"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RenZheng = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let RenZheng = class RenZheng extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "DamageReduced" /* DamageReduced */ || stage === "DamageTerminated" /* DamageTerminated */;
    }
    canUse() {
        return true;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        await room.drawCards(2, event.fromId, 'top', event.fromId, this.Name);
        return true;
    }
};
RenZheng = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'renzheng', description: 'renzheng_description' })
], RenZheng);
exports.RenZheng = RenZheng;
