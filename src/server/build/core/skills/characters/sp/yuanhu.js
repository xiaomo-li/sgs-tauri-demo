"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YuanHu = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let YuanHu = class YuanHu extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        return (content.playerId === owner.Id &&
            content.toStage === 19 /* FinishStageStart */ &&
            owner.getPlayerCards().length > 0);
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, target, selectedCards) {
        return selectedCards.length === 1 && room.canPlaceCardTo(selectedCards[0], target);
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    isAvailableCard(owner, room, cardId) {
        return engine_1.Sanguosha.getCardById(cardId).is(1 /* Equip */);
    }
    getSkillLog() {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to put a equip card into a player’s equip area?', this.Name).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, toIds } = event;
        if (!toIds || !event.cardIds) {
            return false;
        }
        await room.moveCards({
            movingCards: [{ card: event.cardIds[0], fromArea: room.getPlayerById(event.fromId).cardFrom(event.cardIds[0]) }],
            fromId: event.fromId,
            toId: toIds[0],
            toArea: 1 /* EquipArea */,
            moveReason: 2 /* ActiveMove */,
            proposer: event.fromId,
            triggeredBySkills: [this.Name],
        });
        const card = engine_1.Sanguosha.getCardById(event.cardIds[0]);
        if (card.is(2 /* Weapon */)) {
            const targets = room
                .getOtherPlayers(toIds[0])
                .filter(player => room.distanceBetween(room.getPlayerById(toIds[0]), player) === 1 && player.getCardIds().length > 0);
            if (targets.length > 0) {
                const players = targets.map(player => player.Id);
                const resp = await room.doAskForCommonly(167 /* AskForChoosingPlayerEvent */, {
                    players,
                    toId: fromId,
                    requiredAmount: 1,
                    conversation: 'yuanhu: please choose a target to discard a card from his area',
                    triggeredBySkills: [this.Name],
                }, fromId, true);
                resp.selectedPlayers = resp.selectedPlayers || [players[Math.floor(Math.random() * players.length)]];
                const to = room.getPlayerById(resp.selectedPlayers[0]);
                const options = {
                    [2 /* JudgeArea */]: to.getCardIds(2 /* JudgeArea */),
                    [1 /* EquipArea */]: to.getCardIds(1 /* EquipArea */),
                    [0 /* HandArea */]: to.getCardIds(0 /* HandArea */).length,
                };
                const chooseCardEvent = {
                    fromId,
                    toId: resp.selectedPlayers[0],
                    options,
                    triggeredBySkills: [this.Name],
                };
                const response = await room.askForChoosingPlayerCard(chooseCardEvent, fromId, true, true);
                if (!response) {
                    return false;
                }
                await room.dropCards(resp.selectedPlayers[0] === fromId ? 4 /* SelfDrop */ : 5 /* PassiveDrop */, [response.selectedCard], resp.selectedPlayers[0], fromId, this.Name);
            }
        }
        else if (card.is(3 /* Shield */)) {
            await room.drawCards(1, toIds[0], 'top', fromId, this.Name);
        }
        else if (card.is(5 /* DefenseRide */) || card.is(4 /* OffenseRide */)) {
            await room.recover({
                toId: toIds[0],
                recoveredHp: 1,
                recoverBy: fromId,
            });
        }
        return true;
    }
};
YuanHu = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'yuanhu', description: 'yuanhu_description' })
], YuanHu);
exports.YuanHu = YuanHu;
