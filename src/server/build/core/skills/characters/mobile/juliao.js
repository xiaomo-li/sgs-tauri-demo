"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JuLiao = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let JuLiao = class JuLiao extends skill_1.RulesBreakerSkill {
    audioIndex() {
        return 0;
    }
    breakDefenseDistance(room, owner) {
        return (room.AlivePlayers.reduce((allNations, player) => {
            if (!allNations.includes(player.Nationality)) {
                allNations.push(player.Nationality);
            }
            return allNations;
        }, []).length - 1);
    }
};
JuLiao = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'juliao', description: 'juliao_description' })
], JuLiao);
exports.JuLiao = JuLiao;
