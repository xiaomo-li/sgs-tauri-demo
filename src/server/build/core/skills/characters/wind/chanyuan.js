"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChanYuan = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_hooks_1 = require("core/skills/skill_hooks");
const skill_rule_1 = require("core/skills/skill_rule");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let ChanYuan = class ChanYuan extends skill_1.SkillProhibitedSkill {
    async whenObtainingSkill(room, player) {
        if (player.Hp > 1) {
            return;
        }
        for (const playerSkill of player.getSkillProhibitedSkills(true)) {
            skill_rule_1.UniqueSkillRule.isProhibited(playerSkill, player) &&
                (await skill_hooks_1.SkillLifeCycle.executeHookedOnNullifying(playerSkill, room, player));
        }
    }
    async whenLosingSkill(room, player) {
        if (player.Hp > 1) {
            return;
        }
        for (const playerSkill of player.getSkillProhibitedSkills(true)) {
            await skill_hooks_1.SkillLifeCycle.executeHookedOnEffecting(playerSkill, room, player);
        }
    }
    skillFilter(skill, owner, _, unlimited) {
        return (owner.Hp <= 1 || !!unlimited) && skill.GeneralName !== this.Name && owner.hasSkill(skill.Name);
    }
    toDeactivateSkills(room, owner, content, stage) {
        return owner.Hp <= 1 && stage === "AfterHpChange" /* AfterHpChange */;
    }
    toActivateSkills(room, owner, content, stage) {
        return owner.Hp > 1 && stage === "AfterHpChange" /* AfterHpChange */;
    }
};
ChanYuan = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'chanyuan', description: 'chanyuan_description' })
], ChanYuan);
exports.ChanYuan = ChanYuan;
