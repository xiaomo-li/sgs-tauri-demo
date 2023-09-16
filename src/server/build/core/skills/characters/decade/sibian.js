"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SiBian = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let SiBian = class SiBian extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "BeforeDrawCardEffect" /* BeforeDrawCardEffect */;
    }
    canUse(room, owner, content) {
        return (owner.Id === content.fromId &&
            room.CurrentPlayerPhase === 3 /* DrawCardStage */ &&
            content.bySpecialReason === 0 /* GameStage */ &&
            content.drawAmount > 0);
    }
    getSkillLog(room, owner) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to display 4 cards from the top of draw stack?', this.Name).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        event.triggeredOnEvent.drawAmount = 0;
        const displayCards = room.getCards(4, 'top');
        const cardDisplayEvent = {
            displayCards,
            fromId: event.fromId,
            translationsMessage: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} used skill {1}, display cards: {2}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(event.fromId)), this.Name, translation_json_tool_1.TranslationPack.patchCardInTranslation(...displayCards)).extract(),
        };
        room.broadcast(126 /* CardDisplayEvent */, cardDisplayEvent);
        const toGain = [];
        let max = engine_1.Sanguosha.getCardById(displayCards[0]).CardNumber;
        let min = max;
        for (const id of displayCards) {
            const cardNumber = engine_1.Sanguosha.getCardById(id).CardNumber;
            cardNumber > max && (max = cardNumber);
            cardNumber < min && (min = cardNumber);
        }
        toGain.push(...displayCards.filter(id => engine_1.Sanguosha.getCardById(id).CardNumber === max));
        min !== max && toGain.push(...displayCards.filter(id => engine_1.Sanguosha.getCardById(id).CardNumber === min));
        await room.moveCards({
            movingCards: toGain.map(card => ({ card, fromArea: 6 /* ProcessingArea */ })),
            toId: event.fromId,
            toArea: 0 /* HandArea */,
            moveReason: 1 /* ActivePrey */,
            proposer: event.fromId,
            triggeredBySkills: [this.Name],
        });
        const leftCards = displayCards.filter(id => !toGain.includes(id));
        if (leftCards.length > 0) {
            if (leftCards.length === 2 &&
                Math.abs(engine_1.Sanguosha.getCardById(leftCards[0]).CardNumber - engine_1.Sanguosha.getCardById(leftCards[1]).CardNumber) <
                    room.AlivePlayers.length) {
                const minimun = room.getOtherPlayers(event.fromId).reduce((min, player) => {
                    player.getCardIds(0 /* HandArea */).length < min &&
                        (min = player.getCardIds(0 /* HandArea */).length);
                    return min;
                }, room.getPlayerById(event.fromId).getCardIds(0 /* HandArea */).length);
                const players = room.AlivePlayers.filter(player => player.getCardIds(0 /* HandArea */).length === minimun).map(player => player.Id);
                const resp = await room.doAskForCommonly(167 /* AskForChoosingPlayerEvent */, {
                    players,
                    toId: event.fromId,
                    requiredAmount: 1,
                    conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to choose a target to give him {1}', this.Name, translation_json_tool_1.TranslationPack.patchCardInTranslation(...leftCards)).extract(),
                    triggeredBySkills: [this.Name],
                }, event.fromId);
                if (resp.selectedPlayers && resp.selectedPlayers.length > 0) {
                    await room.moveCards({
                        movingCards: leftCards.map(card => ({ card, fromArea: 6 /* ProcessingArea */ })),
                        toId: resp.selectedPlayers[0],
                        toArea: 0 /* HandArea */,
                        moveReason: 2 /* ActiveMove */,
                        proposer: event.fromId,
                        triggeredBySkills: [this.Name],
                    });
                    return true;
                }
            }
            await room.moveCards({
                movingCards: leftCards.map(card => ({ card, fromArea: 6 /* ProcessingArea */ })),
                toArea: 4 /* DropStack */,
                moveReason: 6 /* PlaceToDropStack */,
                proposer: event.fromId,
                triggeredBySkills: [this.Name],
            });
        }
        return true;
    }
};
SiBian = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'sibian', description: 'sibian_description' })
], SiBian);
exports.SiBian = SiBian;
