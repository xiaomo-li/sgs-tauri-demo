"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YouDi = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let YouDi = class YouDi extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        return (content.playerId === owner.Id &&
            content.toStage === 19 /* FinishStageStart */ &&
            owner.getCardIds(0 /* HandArea */).length > 0);
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, targetId) {
        return targetId !== owner;
    }
    getSkillLog() {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to choose another player to let him drop a hand card from you?', this.Name).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, toIds } = event;
        if (!toIds) {
            return false;
        }
        const from = room.getPlayerById(fromId);
        const options = {
            [0 /* HandArea */]: from.getCardIds(0 /* HandArea */).length,
        };
        const response = await room.askForChoosingPlayerCard({
            fromId: toIds[0],
            toId: fromId,
            options,
            triggeredBySkills: [this.Name],
        }, toIds[0], true, true);
        if (!response) {
            return false;
        }
        const isSlash = engine_1.Sanguosha.getCardById(response.selectedCard).GeneralName === 'slash';
        const isBlack = engine_1.Sanguosha.getCardById(response.selectedCard).isBlack();
        await room.dropCards(4 /* SelfDrop */, [response.selectedCard], fromId, toIds[0], this.Name);
        const to = room.getPlayerById(toIds[0]);
        if (!isSlash && to.getPlayerCards().length > 0) {
            const newOptions = {
                [1 /* EquipArea */]: to.getCardIds(1 /* EquipArea */),
                [0 /* HandArea */]: to.getCardIds(0 /* HandArea */).length,
            };
            const resp = await room.askForChoosingPlayerCard({
                fromId,
                toId: toIds[0],
                options: newOptions,
                triggeredBySkills: [this.Name],
            }, fromId, false, true);
            if (!resp) {
                return false;
            }
            await room.moveCards({
                movingCards: [{ card: resp.selectedCard, fromArea: to.cardFrom(resp.selectedCard) }],
                fromId: toIds[0],
                toId: fromId,
                toArea: 0 /* HandArea */,
                moveReason: 1 /* ActivePrey */,
                proposer: fromId,
                triggeredBySkills: [this.Name],
            });
        }
        isBlack || (await room.drawCards(1, fromId, 'top', fromId, this.Name));
        return true;
    }
};
YouDi = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'youdi', description: 'youdi_description' })
], YouDi);
exports.YouDi = YouDi;
