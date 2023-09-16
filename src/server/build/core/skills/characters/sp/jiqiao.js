"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JiQiao = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let JiQiao = class JiQiao extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */ && event.toStage === 13 /* PlayCardStageStart */;
    }
    canUse(room, owner, content) {
        return owner.Id === content.playerId && owner.getPlayerCards().length > 0;
    }
    cardFilter(room, owner, cards) {
        return cards.length > 0;
    }
    isAvailableCard(owner, room, cardId) {
        return engine_1.Sanguosha.getCardById(cardId).is(1 /* Equip */) && room.canDropCard(owner, cardId);
    }
    getSkillLog(room, owner, content) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to discard at least 1 equip card, then display the double cards and gain all unequip cards from these cards?', this.Name).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, cardIds } = event;
        if (!cardIds) {
            return false;
        }
        await room.dropCards(4 /* SelfDrop */, cardIds, fromId, fromId, this.Name);
        const topCards = room.getCards(cardIds.length * 2, 'top');
        const cardDisplayEvent = {
            displayCards: topCards,
            fromId,
            translationsMessage: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} used skill {1}, display cards: {2}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(fromId)), this.Name, translation_json_tool_1.TranslationPack.patchCardInTranslation(...topCards)).extract(),
        };
        room.broadcast(126 /* CardDisplayEvent */, cardDisplayEvent);
        const unequips = topCards.filter(id => !engine_1.Sanguosha.getCardById(id).is(1 /* Equip */));
        unequips.length > 0 &&
            (await room.moveCards({
                movingCards: unequips.map(card => ({ card, fromArea: 6 /* ProcessingArea */ })),
                toId: fromId,
                toArea: 0 /* HandArea */,
                moveReason: 1 /* ActivePrey */,
                proposer: fromId,
                triggeredBySkills: [this.Name],
            }));
        const leftCards = topCards.filter(id => !unequips.includes(id) && room.isCardOnProcessing(id));
        leftCards.length > 0 &&
            (await room.moveCards({
                movingCards: leftCards.map(card => ({ card, fromArea: 6 /* ProcessingArea */ })),
                toArea: 4 /* DropStack */,
                moveReason: 6 /* PlaceToDropStack */,
                proposer: fromId,
                triggeredBySkills: [this.Name],
            }));
        return true;
    }
};
JiQiao = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'jiqiao', description: 'jiqiao_description' })
], JiQiao);
exports.JiQiao = JiQiao;
