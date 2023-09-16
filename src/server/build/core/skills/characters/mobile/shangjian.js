"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShangJian = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let ShangJian = class ShangJian extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, event) {
        const lostCardNum = room.Analytics.getLostCard(owner.Id, 'round').length;
        return event.toStage === 19 /* FinishStageStart */ && lostCardNum > 0 && lostCardNum <= owner.Hp;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        await room.drawCards(room.Analytics.getLostCard(event.fromId, 'round').length, event.fromId, 'top', event.fromId, this.Name);
        return true;
    }
};
ShangJian = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'shangjian', description: 'shangjian_description' })
], ShangJian);
exports.ShangJian = ShangJian;
