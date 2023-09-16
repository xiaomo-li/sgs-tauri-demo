"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CuiRui = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let CuiRui = class CuiRui extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return true;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 0;
    }
    numberOfTargets() {
        return [];
    }
    targetFilter(room, owner, targets) {
        return targets.length > 0 && targets.length <= owner.Hp;
    }
    isAvailableTarget(owner, room, target) {
        return target !== owner && room.getPlayerById(target).getCardIds(0 /* HandArea */).length > 0;
    }
    isAvailableCard() {
        return false;
    }
    async onUse() {
        return true;
    }
    async onEffect(room, event) {
        if (!event.toIds) {
            return false;
        }
        for (const toId of event.toIds) {
            const to = room.getPlayerById(toId);
            const options = {
                [0 /* HandArea */]: to.getCardIds(0 /* HandArea */).length,
            };
            const chooseCardEvent = {
                fromId: event.fromId,
                toId,
                options,
                triggeredBySkills: [this.Name],
            };
            const response = await room.askForChoosingPlayerCard(chooseCardEvent, event.fromId, false, true);
            if (response && response.selectedCard) {
                await room.moveCards({
                    movingCards: [{ card: response.selectedCard, fromArea: 0 /* HandArea */ }],
                    fromId: toId,
                    toId: event.fromId,
                    toArea: 0 /* HandArea */,
                    moveReason: 1 /* ActivePrey */,
                    proposer: event.fromId,
                    triggeredBySkills: [this.Name],
                });
            }
        }
        return true;
    }
};
CuiRui = tslib_1.__decorate([
    skill_wrappers_1.LimitSkill({ name: 'cuirui', description: 'cuirui_description' })
], CuiRui);
exports.CuiRui = CuiRui;
