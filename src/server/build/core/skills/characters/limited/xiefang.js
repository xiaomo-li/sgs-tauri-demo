"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XieFang = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let XieFang = class XieFang extends skill_1.RulesBreakerSkill {
    audioIndex() {
        return 0;
    }
    breakOffenseDistance(room, owner) {
        return room.AlivePlayers.filter(player => player.Gender === 1 /* Female */).length;
    }
};
XieFang = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'xiefang', description: 'xiefang_description' })
], XieFang);
exports.XieFang = XieFang;
