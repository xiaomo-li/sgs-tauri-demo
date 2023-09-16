"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaShu = void 0;
const tslib_1 = require("tslib");
const offense_horse_1 = require("core/skills/cards/standard/offense_horse");
const skill_1 = require("core/skills/skill");
let MaShu = class MaShu extends offense_horse_1.OffenseHorseSkill {
    audioIndex() {
        return 0;
    }
};
MaShu = tslib_1.__decorate([
    skill_1.CompulsorySkill({ name: 'mashu', description: 'mashu_description' })
], MaShu);
exports.MaShu = MaShu;
