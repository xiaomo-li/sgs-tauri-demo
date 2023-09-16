"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZhaoHan = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let ZhaoHan = class ZhaoHan extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        return (owner.Id === content.playerId &&
            3 /* PrepareStageStart */ === content.toStage &&
            owner.hasUsedSkillTimes(this.Name) < 7);
    }
    async onTrigger(room, event) {
        event.audioIndex = room.getPlayerById(event.fromId).hasUsedSkillTimes(this.Name) <= 4 ? 1 : 2;
        return true;
    }
    async onEffect(room, event) {
        const usedTimes = room.getPlayerById(event.fromId).hasUsedSkillTimes(this.Name);
        if (usedTimes <= 4) {
            await room.changeMaxHp(event.fromId, 1);
            await room.recover({
                toId: event.fromId,
                recoveredHp: 1,
                recoverBy: event.fromId,
            });
        }
        else {
            await room.changeMaxHp(event.fromId, -1);
        }
        return true;
    }
};
ZhaoHan = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'zhaohan', description: 'zhaohan_description' })
], ZhaoHan);
exports.ZhaoHan = ZhaoHan;
