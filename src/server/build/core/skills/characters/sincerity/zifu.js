"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZiFu = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const mouli_1 = require("./mouli");
let ZiFu = class ZiFu extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterPlayerDied" /* AfterPlayerDied */;
    }
    canUse(room, owner, content) {
        return room.getFlag(content.playerId, mouli_1.MouLi.MouLiLi) !== undefined;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        await room.changeMaxHp(event.fromId, -2);
        return true;
    }
};
ZiFu = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'zifu', description: 'zifu_description' })
], ZiFu);
exports.ZiFu = ZiFu;
