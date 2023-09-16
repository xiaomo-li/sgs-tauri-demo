"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZhaoFu = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let ZhaoFu = class ZhaoFu extends skill_1.GlobalRulesBreakerSkill {
    audioIndex() {
        return 0;
    }
    breakWithinAttackDistance(room, owner, from, to) {
        return room.distanceBetween(owner, to) === 1 && from !== to && from.Nationality === 2 /* Wu */;
    }
};
ZhaoFu = tslib_1.__decorate([
    skill_wrappers_1.LordSkill,
    skill_wrappers_1.CompulsorySkill({ name: 'zhaofu', description: 'zhaofu_description' })
], ZhaoFu);
exports.ZhaoFu = ZhaoFu;
