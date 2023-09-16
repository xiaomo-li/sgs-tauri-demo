"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiuLi = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const aim_group_1 = require("core/shares/libs/utils/aim_group");
const skill_1 = require("core/skills/skill");
let LiuLi = class LiuLi extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return (stage === "OnAimmed" /* OnAimmed */ &&
            event.byCardId !== undefined &&
            engine_1.Sanguosha.getCardById(event.byCardId).GeneralName === 'slash');
    }
    canUse(room, owner, event) {
        room.setFlag(owner.Id, this.Name, event.fromId);
        return event.toId === owner.Id && owner.getPlayerCards().length > 0;
    }
    targetFilter(room, owner, targets) {
        return targets.length === 1;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    isAvailableCard(owner, room, cardId) {
        return room.canDropCard(owner, cardId);
    }
    availableCardAreas() {
        return [1 /* EquipArea */, 0 /* HandArea */];
    }
    isAvailableTarget(owner, room, targetId) {
        const from = room.getPlayerById(owner);
        const to = room.getPlayerById(targetId);
        const userId = from.getFlag(this.Name);
        return room.canAttack(from, to) && targetId !== userId;
    }
    async onTrigger(room, skillUseEvent) {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const { triggeredOnEvent, cardIds, toIds, fromId } = skillUseEvent;
        if (!toIds) {
            return false;
        }
        const aimEvent = triggeredOnEvent;
        await room.dropCards(4 /* SelfDrop */, cardIds, fromId, fromId, this.Name);
        aim_group_1.AimGroupUtil.cancelTarget(aimEvent, fromId);
        aim_group_1.AimGroupUtil.addTargets(room, aimEvent, toIds[0]);
        event_packer_1.EventPacker.terminate(aimEvent);
        return true;
    }
};
LiuLi = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'liuli', description: 'liuli_description' })
], LiuLi);
exports.LiuLi = LiuLi;
