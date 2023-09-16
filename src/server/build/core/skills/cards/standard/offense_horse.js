"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OffenseHorseSkill = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
let OffenseHorseSkill = class OffenseHorseSkill extends skill_1.RulesBreakerSkill {
    breakOffenseDistance() {
        return 1;
    }
};
OffenseHorseSkill = tslib_1.__decorate([
    skill_1.CompulsorySkill({ name: 'offense_horse', description: 'offense_horse_description' })
], OffenseHorseSkill);
exports.OffenseHorseSkill = OffenseHorseSkill;
