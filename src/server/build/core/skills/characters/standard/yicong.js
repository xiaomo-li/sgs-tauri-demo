"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YiCong = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
let YiCong = class YiCong extends skill_1.RulesBreakerSkill {
    breakDefenseDistance(room, owner) {
        return owner.Hp <= 2 ? 1 : 0;
    }
    breakOffenseDistance(room, owner) {
        return 1;
    }
};
YiCong = tslib_1.__decorate([
    skill_1.CompulsorySkill({ name: 'yicong', description: 'yicong_description' })
], YiCong);
exports.YiCong = YiCong;
