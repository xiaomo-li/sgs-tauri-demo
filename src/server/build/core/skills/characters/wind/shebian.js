"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SheBian = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
let SheBian = class SheBian extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "TurnedOver" /* TurnedOver */;
    }
    canUse(room, owner, event) {
        return owner.Id === event.toId;
    }
    targetFilter(room, owner, targets) {
        return targets.length === 2;
    }
    isAvailableTarget(owner, room, target, selectedCards, selectedTargets) {
        const to = room.getPlayerById(target);
        const equiprCardIds = to.getCardIds(1 /* EquipArea */);
        const judgeCardIds = to.getCardIds(2 /* JudgeArea */);
        if (selectedTargets.length === 0) {
            return equiprCardIds.length + judgeCardIds.length > 0;
        }
        else if (selectedTargets.length === 1) {
            let canBeTarget = false;
            const from = room.getPlayerById(selectedTargets[0]);
            const fromEquipArea = from.getCardIds(1 /* EquipArea */);
            canBeTarget = canBeTarget || fromEquipArea.find(id => room.canPlaceCardTo(id, target)) !== undefined;
            const fromJudgeArea = from.getCardIds(2 /* JudgeArea */);
            canBeTarget = canBeTarget || fromJudgeArea.find(id => room.canPlaceCardTo(id, target)) !== undefined;
            return canBeTarget;
        }
        return false;
    }
    getAnimationSteps(event) {
        const { fromId, toIds } = event;
        return [
            { from: fromId, tos: [toIds[0]] },
            { from: toIds[0], tos: [toIds[1]] },
        ];
    }
    resortTargets() {
        return false;
    }
    async onUse(room, event) {
        event.animation = this.getAnimationSteps(event);
        return true;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const moveFrom = room.getPlayerById(skillUseEvent.toIds[0]);
        const moveTo = room.getPlayerById(skillUseEvent.toIds[1]);
        const canMovedEquipCardIds = [];
        const canMovedJudgeCardIds = [];
        const fromEquipArea = moveFrom.getCardIds(1 /* EquipArea */);
        canMovedEquipCardIds.push(...fromEquipArea.filter(id => room.canPlaceCardTo(id, moveTo.Id)));
        const fromJudgeArea = moveFrom.getCardIds(2 /* JudgeArea */);
        canMovedJudgeCardIds.push(...fromJudgeArea.filter(id => room.canPlaceCardTo(id, moveTo.Id)));
        const options = {
            [2 /* JudgeArea */]: canMovedJudgeCardIds,
            [1 /* EquipArea */]: canMovedEquipCardIds,
        };
        const chooseCardEvent = {
            fromId: skillUseEvent.fromId,
            toId: skillUseEvent.fromId,
            options,
            triggeredBySkills: [this.Name],
        };
        room.notify(170 /* AskForChoosingCardFromPlayerEvent */, event_packer_1.EventPacker.createUncancellableEvent(chooseCardEvent), skillUseEvent.fromId);
        const response = await room.onReceivingAsyncResponseFrom(170 /* AskForChoosingCardFromPlayerEvent */, skillUseEvent.fromId);
        await room.moveCards({
            movingCards: [{ card: response.selectedCard, fromArea: response.fromArea }],
            moveReason: 3 /* PassiveMove */,
            toId: moveTo.Id,
            fromId: moveFrom.Id,
            toArea: response.fromArea,
            proposer: chooseCardEvent.fromId,
            movedByReason: this.Name,
        });
        return true;
    }
};
SheBian = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'shebian', description: 'shebian_description' })
], SheBian);
exports.SheBian = SheBian;
