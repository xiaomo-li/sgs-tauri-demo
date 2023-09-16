"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeiYing = void 0;
const tslib_1 = require("tslib");
const defense_horse_1 = require("core/skills/cards/standard/defense_horse");
const skill_1 = require("core/skills/skill");
let FeiYing = class FeiYing extends defense_horse_1.DefenseHorseSkill {
    audioIndex() {
        return 0;
    }
};
FeiYing = tslib_1.__decorate([
    skill_1.CompulsorySkill({ name: 'feiying', description: 'feiying_description' })
], FeiYing);
exports.FeiYing = FeiYing;
