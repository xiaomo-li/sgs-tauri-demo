"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GongAo = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let GongAo = class GongAo extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterPlayerDied" /* AfterPlayerDied */;
    }
    canUse(room, owner, content) {
        return content.playerId !== owner.Id && !owner.Dead;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        await room.changeMaxHp(event.fromId, 1);
        await room.recover({
            toId: event.fromId,
            recoveredHp: 1,
            recoverBy: event.fromId,
        });
        return true;
    }
};
GongAo = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'gongao', description: 'gongao_description' })
], GongAo);
exports.GongAo = GongAo;
