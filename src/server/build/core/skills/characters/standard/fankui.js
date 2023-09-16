"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FanKui = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
let FanKui = class FanKui extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterDamagedEffect" /* AfterDamagedEffect */;
    }
    canUse(room, owner, content) {
        const damageFrom = content.fromId !== undefined && room.getPlayerById(content.fromId);
        return (owner.Id === content.toId &&
            damageFrom &&
            !damageFrom.Dead &&
            (content.toId === content.fromId
                ? damageFrom.getCardIds(1 /* EquipArea */).length > 0
                : damageFrom.getPlayerCards().length > 0));
    }
    triggerableTimes(event) {
        return event.damage;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const { triggeredOnEvent } = skillUseEvent;
        const { fromId } = triggeredOnEvent;
        if (fromId !== undefined) {
            const damageFrom = room.getPlayerById(fromId);
            const options = {
                [1 /* EquipArea */]: damageFrom.getCardIds(1 /* EquipArea */),
            };
            if (fromId !== skillUseEvent.fromId) {
                options[0 /* HandArea */] = damageFrom.getCardIds(0 /* HandArea */).length;
            }
            const chooseCardEvent = {
                fromId: skillUseEvent.fromId,
                toId: fromId,
                options,
                triggeredBySkills: [this.Name],
            };
            const response = await room.askForChoosingPlayerCard(chooseCardEvent, chooseCardEvent.fromId, false, true);
            if (!response) {
                return false;
            }
            await room.moveCards({
                movingCards: [{ card: response.selectedCard, fromArea: response.fromArea }],
                fromId: chooseCardEvent.toId,
                toId: chooseCardEvent.fromId,
                toArea: 0 /* HandArea */,
                moveReason: 1 /* ActivePrey */,
                proposer: chooseCardEvent.fromId,
                movedByReason: this.Name,
            });
        }
        return true;
    }
};
FanKui = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'fankui', description: 'fankui_description' })
], FanKui);
exports.FanKui = FanKui;
