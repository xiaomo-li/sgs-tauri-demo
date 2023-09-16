"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JunLve = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let JunLve = class JunLve extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterDamageEffect" /* AfterDamageEffect */ || stage === "AfterDamagedEffect" /* AfterDamagedEffect */;
    }
    triggerableTimes(event) {
        return event.damage;
    }
    canUse(room, owner, content, stage) {
        return ((content.fromId === owner.Id && stage === "AfterDamageEffect" /* AfterDamageEffect */) ||
            (content.toId === owner.Id && stage === "AfterDamagedEffect" /* AfterDamagedEffect */));
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        room.addMark(skillUseEvent.fromId, "junlve" /* JunLve */, 1);
        return true;
    }
};
JunLve = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'junlve', description: 'junlve_description' })
], JunLve);
exports.JunLve = JunLve;
