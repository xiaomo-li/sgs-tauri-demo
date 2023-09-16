"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaoBian = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const tiaoxin_1 = require("../mountain/tiaoxin");
const paoxiao_1 = require("../standard/paoxiao");
const shensu_1 = require("../wind/shensu");
let BaoBian = class BaoBian extends skill_1.TriggerSkill {
    get RelatedSkills() {
        return [tiaoxin_1.TiaoXin.Name, paoxiao_1.PaoXiao.Name, shensu_1.ShenSu.Name];
    }
    audioIndex() {
        return 0;
    }
    isTriggerable(event, stage) {
        return stage === "AfterDamagedEffect" /* AfterDamagedEffect */;
    }
    canUse(room, owner, content) {
        return content.toId === owner.Id && owner.hasUsedSkillTimes(this.Name) < 3;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        await room.obtainSkill(event.fromId, this.RelatedSkills[room.getPlayerById(event.fromId).hasUsedSkillTimes(this.Name) - 1]);
        return true;
    }
};
BaoBian = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'baobian', description: 'baobian_description' })
], BaoBian);
exports.BaoBian = BaoBian;
