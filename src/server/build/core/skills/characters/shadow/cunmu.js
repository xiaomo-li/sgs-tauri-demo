"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CunMu = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
let CunMu = class CunMu extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "BeforeDrawCardEffect" /* BeforeDrawCardEffect */;
    }
    getPriority() {
        return 0 /* High */;
    }
    canUse(room, owner, content) {
        return owner.Id === content.fromId;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const drawCardEvent = event.triggeredOnEvent;
        drawCardEvent.from = 'bottom';
        return true;
    }
};
CunMu = tslib_1.__decorate([
    skill_1.CompulsorySkill({ name: 'cunmu', description: 'cunmu_description' })
], CunMu);
exports.CunMu = CunMu;
