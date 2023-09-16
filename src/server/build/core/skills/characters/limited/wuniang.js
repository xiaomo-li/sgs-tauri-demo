"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WuNiang = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
const xushen_1 = require("./xushen");
let WuNiang = class WuNiang extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "CardUsing" /* CardUsing */ || stage === "CardResponsing" /* CardResponsing */;
    }
    canUse(room, owner, event) {
        return (event.fromId === owner.Id &&
            engine_1.Sanguosha.getCardById(event.cardId).GeneralName === 'slash' &&
            room.getOtherPlayers(owner.Id).find(player => player.getPlayerCards().length > 0) !== undefined);
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, target) {
        return owner !== target && room.getPlayerById(target).getPlayerCards().length > 0;
    }
    getSkillLog() {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to prey a card from another player?', this.Name).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, toIds } = event;
        if (!toIds) {
            return false;
        }
        const to = room.getPlayerById(toIds[0]);
        const options = {
            [1 /* EquipArea */]: to.getCardIds(1 /* EquipArea */),
            [0 /* HandArea */]: to.getCardIds(0 /* HandArea */).length,
        };
        const chooseCardEvent = {
            fromId,
            toId: toIds[0],
            options,
            triggeredBySkills: [this.Name],
        };
        const response = await room.askForChoosingPlayerCard(chooseCardEvent, fromId, false, true);
        if (!response) {
            return false;
        }
        await room.moveCards({
            movingCards: [{ card: response.selectedCard, fromArea: response.fromArea }],
            fromId: toIds[0],
            toId: fromId,
            toArea: 0 /* HandArea */,
            moveReason: 1 /* ActivePrey */,
            proposer: fromId,
            triggeredBySkills: [this.Name],
        });
        await room.drawCards(1, toIds[0], 'top', fromId, this.Name);
        if (room.getPlayerById(fromId).hasUsedSkill(xushen_1.XuShen.Name)) {
            for (const player of room.getAllPlayersFrom()) {
                if (player.Character.Name === 'guansuo') {
                    await room.drawCards(1, player.Id, 'top', fromId, this.Name);
                }
            }
        }
        return true;
    }
};
WuNiang = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'wuniang', description: 'wuniang_description' })
], WuNiang);
exports.WuNiang = WuNiang;
