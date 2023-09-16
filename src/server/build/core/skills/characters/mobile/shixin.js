"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShiXin = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let ShiXin = class ShiXin extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "DamagedEffect" /* DamagedEffect */;
    }
    canUse(room, owner, content) {
        return content.toId === owner.Id && content.damageType === "fire_property" /* Fire */;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        event_packer_1.EventPacker.terminate(event.triggeredOnEvent);
        return true;
    }
};
ShiXin = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'shixin', description: 'shixin_description' })
], ShiXin);
exports.ShiXin = ShiXin;
