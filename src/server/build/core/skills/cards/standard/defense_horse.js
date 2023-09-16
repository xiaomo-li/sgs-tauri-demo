"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefenseHorseSkill = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
let DefenseHorseSkill = class DefenseHorseSkill extends skill_1.RulesBreakerSkill {
    breakDefenseDistance() {
        return 1;
    }
};
DefenseHorseSkill = tslib_1.__decorate([
    skill_1.CompulsorySkill({ name: 'defense_horse', description: 'defense_horse_description' })
], DefenseHorseSkill);
exports.DefenseHorseSkill = DefenseHorseSkill;
