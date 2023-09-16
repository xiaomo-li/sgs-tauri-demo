"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShenWeiShadow = exports.ShenWei = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let ShenWei = class ShenWei extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "CardDrawing" /* CardDrawing */;
    }
    canUse(room, owner, content) {
        return (owner.Id === content.fromId &&
            room.CurrentPlayerPhase === 3 /* DrawCardStage */ &&
            content.bySpecialReason === 0 /* GameStage */);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const drawCardEvent = event.triggeredOnEvent;
        drawCardEvent.drawAmount += 2;
        return true;
    }
};
ShenWei = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'shenwei', description: 'shenwei_description' })
], ShenWei);
exports.ShenWei = ShenWei;
let ShenWeiShadow = class ShenWeiShadow extends skill_1.RulesBreakerSkill {
    breakAdditionalCardHoldNumber() {
        return 2;
    }
};
ShenWeiShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.CompulsorySkill({ name: ShenWei.GeneralName, description: ShenWei.Description })
], ShenWeiShadow);
exports.ShenWeiShadow = ShenWeiShadow;
