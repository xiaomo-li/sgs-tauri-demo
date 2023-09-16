"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JieWeiShadow = exports.JieWei = void 0;
const tslib_1 = require("tslib");
const card_1 = require("core/cards/card");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let JieWei = class JieWei extends skill_1.ViewAsSkill {
    canViewAs() {
        return ['wuxiekeji'];
    }
    canUse(room, owner) {
        return (owner.canUseCard(room, new card_matcher_1.CardMatcher({ name: ['wuxiekeji'] })) &&
            owner.getCardIds(1 /* EquipArea */).length > 0);
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    isAvailableCard(room, owner, pendingCardId) {
        return true;
    }
    availableCardAreas() {
        return [1 /* EquipArea */];
    }
    viewAs(selectedCards) {
        return card_1.VirtualCard.create({
            cardName: 'wuxiekeji',
            bySkill: this.Name,
        }, selectedCards);
    }
};
JieWei = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'jiewei', description: 'jiewei_description' })
], JieWei);
exports.JieWei = JieWei;
let JieWeiShadow = class JieWeiShadow extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "TurnedOver" /* TurnedOver */;
    }
    canUse(room, owner, event) {
        return owner.Id === event.toId && owner.isFaceUp();
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    isAvailableCard(owner, room, cardId) {
        return room.canDropCard(owner, cardId);
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
        await room.dropCards(4 /* SelfDrop */, skillUseEvent.cardIds, skillUseEvent.fromId, skillUseEvent.fromId, this.Name);
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
JieWeiShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_1.CommonSkill({ name: JieWei.GeneralName, description: JieWei.Description })
], JieWeiShadow);
exports.JieWeiShadow = JieWeiShadow;
