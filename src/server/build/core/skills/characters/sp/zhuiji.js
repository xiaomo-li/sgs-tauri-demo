"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZhuiJi = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let ZhuiJi = class ZhuiJi extends skill_1.RulesBreakerSkill {
    audioIndex() {
        return 0;
    }
    breakDistanceTo(room, owner, target) {
        return target.Hp <= owner.Hp ? 1 : 0;
    }
};
ZhuiJi = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'zhuiji', description: 'zhuiji_description' })
], ZhuiJi);
exports.ZhuiJi = ZhuiJi;
