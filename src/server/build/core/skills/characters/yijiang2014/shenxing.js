"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShenXing = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
let ShenXing = class ShenXing extends skill_1.ActiveSkill {
    canUse() {
        return true;
    }
    numberOfTargets() {
        return 0;
    }
    cardFilter(room, owner, cards) {
        return cards.length === Math.min(2, owner.hasUsedSkillTimes(this.Name));
    }
    isAvailableTarget() {
        return false;
    }
    isAvailableCard(owner, room, cardId) {
        return room.canDropCard(owner, cardId);
    }
    async onUse(room, event) {
        return true;
    }
    async onEffect(room, event) {
        if (room.getPlayerById(event.fromId).hasUsedSkillTimes(this.Name) > 1 && event.cardIds) {
            await room.dropCards(4 /* SelfDrop */, event.cardIds, event.fromId, event.fromId, this.Name);
        }
        await room.drawCards(1, event.fromId, 'top', event.fromId, this.Name);
        return true;
    }
};
ShenXing = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'shenxing', description: 'shenxing_description' })
], ShenXing);
exports.ShenXing = ShenXing;
