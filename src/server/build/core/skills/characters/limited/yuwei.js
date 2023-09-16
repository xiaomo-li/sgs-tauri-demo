"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YuWei = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let YuWei = class YuWei extends skill_1.Skill {
    audioIndex() {
        return 0;
    }
    canUse() {
        return false;
    }
    isRefreshAt() {
        return false;
    }
    async onUse() {
        return true;
    }
    async onEffect() {
        return true;
    }
};
YuWei = tslib_1.__decorate([
    skill_wrappers_1.LordSkill,
    skill_wrappers_1.CompulsorySkill({ name: 'yuwei', description: 'yuwei_description' })
], YuWei);
exports.YuWei = YuWei;
