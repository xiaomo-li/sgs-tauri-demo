"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DuanChang = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
let DuanChang = class DuanChang extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "PlayerDied" /* PlayerDied */ && event.killedBy !== undefined;
    }
    canUse(room, owner, event) {
        return owner.Id === event.playerId && owner.Dead;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const { triggeredOnEvent } = skillUseEvent;
        const { killedBy } = triggeredOnEvent;
        const to = room.getPlayerById(killedBy);
        await room.loseSkill(to.Id, to
            .getPlayerSkills()
            .filter(skill => !skill.isShadowSkill())
            .map(skill => skill.Name), true);
        room.setFlag(killedBy, this.GeneralName, true, this.GeneralName);
        return true;
    }
};
DuanChang = tslib_1.__decorate([
    skill_1.CompulsorySkill({ name: 'duanchang', description: 'duanchang_description' })
], DuanChang);
exports.DuanChang = DuanChang;
