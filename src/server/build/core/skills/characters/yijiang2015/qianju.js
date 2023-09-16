"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QianJu = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let QianJu = class QianJu extends skill_1.RulesBreakerSkill {
    audioIndex() {
        return 0;
    }
    breakOffenseDistance(room, owner) {
        return owner.LostHp;
    }
};
QianJu = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'qianju', description: 'qianju_description' })
], QianJu);
exports.QianJu = QianJu;
