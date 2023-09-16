"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GongQing = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let GongQing = class GongQing extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "DamagedEffect" /* DamagedEffect */;
    }
    canUse(room, owner, content) {
        if (!content.fromId || content.toId !== owner.Id) {
            return false;
        }
        const source = room.getPlayerById(content.fromId);
        return source.getAttackRange(room) > 3 || (source.getAttackRange(room) < 3 && content.damage > 1);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const damageEvent = event.triggeredOnEvent;
        const source = room.getPlayerById(damageEvent.fromId);
        if (source.getAttackRange(room) > 3) {
            damageEvent.damage++;
        }
        else {
            damageEvent.damage = 1;
        }
        return true;
    }
};
GongQing = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'gongqing', description: 'gongqing_description' })
], GongQing);
exports.GongQing = GongQing;
