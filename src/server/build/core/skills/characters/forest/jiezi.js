"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JieZi = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let JieZi = class JieZi extends skill_1.TriggerSkill {
    isTriggerable(event) {
        return (event_packer_1.EventPacker.getIdentifier(event) === 154 /* PhaseSkippedEvent */ &&
            event.skippedPhase === 3 /* DrawCardStage */);
    }
    canUse(room, owner, event) {
        return owner.Id !== event.playerId;
    }
    async onTrigger(room, content) {
        return true;
    }
    async onEffect(room, event) {
        await room.drawCards(1, event.fromId, 'top', event.fromId, this.Name);
        return true;
    }
};
JieZi = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'jiezi', description: 'jiezi_description' })
], JieZi);
exports.JieZi = JieZi;
