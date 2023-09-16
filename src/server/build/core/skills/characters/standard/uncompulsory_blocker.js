"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UncompulsoryBlocker = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_hooks_1 = require("core/skills/skill_hooks");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let UncompulsoryBlocker = class UncompulsoryBlocker extends skill_1.SkillProhibitedSkill {
    async whenObtainingSkill(room, player) {
        for (const playerSkill of player.getSkillProhibitedSkills(true)) {
            this.skillFilter(playerSkill, player) &&
                (await skill_hooks_1.SkillLifeCycle.executeHookedOnNullifying(playerSkill, room, player));
        }
    }
    async whenLosingSkill(room, player) {
        for (const playerSkill of player.getSkillProhibitedSkills(true)) {
            this.skillFilter(playerSkill, player) &&
                (await skill_hooks_1.SkillLifeCycle.executeHookedOnEffecting(playerSkill, room, player));
        }
    }
    skillFilter(skill, owner) {
        return ![1 /* Compulsory */, 2 /* Awaken */].includes(skill.SkillType);
    }
};
UncompulsoryBlocker = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: 'uncompulsory_blocker', description: 'uncompulsory_blocker_description' })
], UncompulsoryBlocker);
exports.UncompulsoryBlocker = UncompulsoryBlocker;
