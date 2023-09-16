"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZhuiXi = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let ZhuiXi = class ZhuiXi extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "DamageEffect" /* DamageEffect */;
    }
    canUse(room, owner, content) {
        return ((content.fromId === owner.Id && room.getPlayerById(content.toId).isFaceUp() !== owner.isFaceUp()) ||
            (content.fromId !== undefined &&
                content.toId === owner.Id &&
                room.getPlayerById(content.fromId).isFaceUp() !== owner.isFaceUp()));
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const damageEvent = event.triggeredOnEvent;
        damageEvent.damage++;
        return true;
    }
};
ZhuiXi = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'zhuixi', description: 'zhuixi_description' })
], ZhuiXi);
exports.ZhuiXi = ZhuiXi;
