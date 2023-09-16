"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FenWei = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const aim_group_1 = require("core/shares/libs/utils/aim_group");
const skill_1 = require("core/skills/skill");
let FenWei = class FenWei extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return (stage === "AfterAim" /* AfterAim */ &&
            engine_1.Sanguosha.getCardById(event.byCardId).AOE !== 1 /* Single */ &&
            engine_1.Sanguosha.getCardById(event.byCardId).is(7 /* Trick */) &&
            aim_group_1.AimGroupUtil.getAllTargets(event.allTargets).length > 1 &&
            event.isFirstTarget);
    }
    canUse(room, owner, event) {
        room.setFlag(owner.Id, this.Name, aim_group_1.AimGroupUtil.getAllTargets(event.allTargets));
        return true;
    }
    targetFilter(room, owner, targets) {
        return targets.length > 0;
    }
    isAvailableTarget(owner, room, targetId) {
        const cardTargets = room.getPlayerById(owner).getFlag(this.Name);
        return cardTargets.includes(targetId);
    }
    async onTrigger(room, skillUseEvent) {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const { triggeredOnEvent, toIds } = skillUseEvent;
        const aimEvent = triggeredOnEvent;
        aimEvent.nullifiedTargets = [...aimEvent.nullifiedTargets, ...toIds];
        return true;
    }
};
FenWei = tslib_1.__decorate([
    skill_1.LimitSkill({ name: 'fenwei', description: 'fenwei_description' })
], FenWei);
exports.FenWei = FenWei;
