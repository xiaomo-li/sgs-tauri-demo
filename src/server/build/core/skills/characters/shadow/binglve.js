"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BingLve = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const feijun_1 = require("./feijun");
let BingLve = class BingLve extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterSkillEffected" /* AfterSkillEffected */;
    }
    canUse(room, owner, content) {
        return content.fromId === owner.Id && event_packer_1.EventPacker.getMiddleware(feijun_1.FeiJun.Name, content) === true;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        await room.drawCards(2, event.fromId, 'top', event.fromId, this.Name);
        return true;
    }
};
BingLve = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'binglve', description: 'binglve_description' })
], BingLve);
exports.BingLve = BingLve;
