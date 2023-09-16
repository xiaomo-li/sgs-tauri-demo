"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.J3ZongShi = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let J3ZongShi = class J3ZongShi extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "PinDianConfirmed" /* PinDianResultConfirmed */;
    }
    canUse(room, owner, pindianEvent) {
        const currentProcedureIndex = pindianEvent.procedures.length - 1;
        return pindianEvent.fromId === owner.Id || pindianEvent.procedures[currentProcedureIndex].toId === owner.Id;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillEffectEvent) {
        const pindianEvent = skillEffectEvent.triggeredOnEvent;
        const currentProcedureIndex = pindianEvent.procedures.length - 1;
        const currentProcedure = pindianEvent.procedures[currentProcedureIndex];
        let moveCardId;
        if (currentProcedure.winner === skillEffectEvent.fromId) {
            moveCardId = currentProcedure.cardId;
        }
        else {
            moveCardId = pindianEvent.cardId;
        }
        await room.moveCards({
            movingCards: [{ card: moveCardId, fromArea: 6 /* ProcessingArea */ }],
            moveReason: 1 /* ActivePrey */,
            toId: skillEffectEvent.fromId,
            toArea: 0 /* HandArea */,
            proposer: skillEffectEvent.fromId,
            movedByReason: this.Name,
        });
        return true;
    }
};
J3ZongShi = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'j3_zongshi', description: 'j3_zongshi_description' })
], J3ZongShi);
exports.J3ZongShi = J3ZongShi;
