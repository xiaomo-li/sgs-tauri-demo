"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JuGuShadow = exports.JuGu = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let JuGu = class JuGu extends skill_1.TriggerSkill {
    isAutoTrigger() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "AfterGameBegan" /* AfterGameBegan */;
    }
    canUse(room, owner, content) {
        return true;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        await room.drawCards(room.getPlayerById(event.fromId).MaxHp, event.fromId, 'top', event.fromId, this.Name);
        return true;
    }
};
JuGu = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'jugu', description: 'jugu_description' })
], JuGu);
exports.JuGu = JuGu;
let JuGuShadow = class JuGuShadow extends skill_1.RulesBreakerSkill {
    breakAdditionalCardHoldNumber(room, owner) {
        return owner.MaxHp;
    }
};
JuGuShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.CompulsorySkill({ name: JuGu.Name, description: JuGu.Description })
], JuGuShadow);
exports.JuGuShadow = JuGuShadow;
