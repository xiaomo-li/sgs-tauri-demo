"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FireSlashSkill = void 0;
const tslib_1 = require("tslib");
const slash_1 = require("core/ai/skills/cards/slash");
const skill_1 = require("core/skills/skill");
const slash_2 = require("../standard/slash");
let FireSlashSkill = class FireSlashSkill extends slash_2.SlashSkill {
    constructor() {
        super(...arguments);
        this.damageType = "fire_property" /* Fire */;
    }
};
FireSlashSkill = tslib_1.__decorate([
    skill_1.AI(slash_1.SlashSkillTrigger),
    skill_1.CommonSkill({ name: 'fire_slash', description: 'fire_slash_description' })
], FireSlashSkill);
exports.FireSlashSkill = FireSlashSkill;
