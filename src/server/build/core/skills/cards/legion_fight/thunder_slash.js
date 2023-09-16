"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThunderSlashSkill = void 0;
const tslib_1 = require("tslib");
const slash_1 = require("core/ai/skills/cards/slash");
const skill_1 = require("core/skills/skill");
const slash_2 = require("../standard/slash");
let ThunderSlashSkill = class ThunderSlashSkill extends slash_2.SlashSkill {
    constructor() {
        super(...arguments);
        this.damageType = "thunder_property" /* Thunder */;
    }
};
ThunderSlashSkill = tslib_1.__decorate([
    skill_1.AI(slash_1.SlashSkillTrigger),
    skill_1.CommonSkill({ name: 'thunder_slash', description: 'thunder_slash_description' })
], ThunderSlashSkill);
exports.ThunderSlashSkill = ThunderSlashSkill;
