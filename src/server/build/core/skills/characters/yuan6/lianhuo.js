"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LianHuo = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let LianHuo = class LianHuo extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "DamagedEffect" /* DamagedEffect */;
    }
    canUse(room, owner, event) {
        return (event.toId === owner.Id && !event.isFromChainedDamage && event.damageType === "fire_property" /* Fire */ && owner.ChainLocked);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        event.triggeredOnEvent.damage++;
        return true;
    }
};
LianHuo = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'lianhuo', description: 'lianhuo_description' })
], LianHuo);
exports.LianHuo = LianHuo;
