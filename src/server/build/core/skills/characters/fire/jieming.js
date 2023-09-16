"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JieMing = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
let JieMing = class JieMing extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterDamagedEffect" /* AfterDamagedEffect */;
    }
    canUse(room, owner, event) {
        return owner.Id === event.toId;
    }
    triggerableTimes(event) {
        return event.damage;
    }
    targetFilter(room, owner, targets) {
        return targets.length === 1;
    }
    isAvailableTarget() {
        return true;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const { toIds, fromId } = skillUseEvent;
        await room.drawCards(2, toIds[0], 'top', fromId, this.Name);
        const target = room.getPlayerById(toIds[0]);
        if (target.getCardIds(0 /* HandArea */).length < target.MaxHp) {
            await room.drawCards(1, fromId, 'top', fromId, this.Name);
        }
        return true;
    }
};
JieMing = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'jieming', description: 'jieming_description' })
], JieMing);
exports.JieMing = JieMing;
