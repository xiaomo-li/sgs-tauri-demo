"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HuaiZi = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let HuaiZi = class HuaiZi extends skill_1.RulesBreakerSkill {
    audioIndex() {
        return 0;
    }
    breakBaseCardHoldNumber(room, owner) {
        return owner.MaxHp;
    }
};
HuaiZi = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'huaizi', description: 'huaizi_description' })
], HuaiZi);
exports.HuaiZi = HuaiZi;
