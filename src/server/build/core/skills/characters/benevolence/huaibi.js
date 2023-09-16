"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HuaiBi = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const yaohu_1 = require("./yaohu");
let HuaiBi = class HuaiBi extends skill_1.RulesBreakerSkill {
    breakAdditionalCardHoldNumber(room, owner) {
        const nationality = owner.getFlag(yaohu_1.YaoHu.Name);
        return nationality !== undefined
            ? room.AlivePlayers.filter(player => player.Nationality === nationality).length
            : 0;
    }
};
HuaiBi = tslib_1.__decorate([
    skill_wrappers_1.LordSkill,
    skill_wrappers_1.CompulsorySkill({ name: 'huaibi', description: 'huaibi_description' })
], HuaiBi);
exports.HuaiBi = HuaiBi;
