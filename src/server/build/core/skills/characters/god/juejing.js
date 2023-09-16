"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JueJingDying = exports.JueJing = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let JueJing = class JueJing extends skill_1.RulesBreakerSkill {
    breakAdditionalCardHoldNumber() {
        return 2;
    }
};
JueJing = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'juejing', description: 'juejing_description' })
], JueJing);
exports.JueJing = JueJing;
let JueJingDying = class JueJingDying extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "PlayerDying" /* PlayerDying */ || stage === "AfterPlayerDying" /* AfterPlayerDying */;
    }
    canUse(room, owner, event) {
        return event.dying === owner.Id;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillEffectEvent) {
        await room.drawCards(1, skillEffectEvent.fromId, 'top', undefined, this.GeneralName);
        return true;
    }
};
JueJingDying = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.CompulsorySkill({ name: JueJing.Name, description: JueJing.Description })
], JueJingDying);
exports.JueJingDying = JueJingDying;
