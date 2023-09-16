"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiJian = void 0;
const tslib_1 = require("tslib");
const card_1 = require("core/cards/card");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const skill_1 = require("core/skills/skill");
let LiJian = class LiJian extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return !owner.hasUsedSkill(this.Name);
    }
    numberOfTargets() {
        return 2;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    isAvailableTarget(owner, room, target, selectedCards, selectedTargets) {
        let canUse = room.getPlayerById(target).Gender === 0 /* Male */;
        if (selectedTargets.length === 0) {
            canUse = canUse && room.getPlayerById(owner).canUseCardTo(room, new card_matcher_1.CardMatcher({ name: ['duel'] }), target);
        }
        return canUse;
    }
    isAvailableCard(owner, room, cardId) {
        return room.canDropCard(owner, cardId);
    }
    getAnimationSteps(event) {
        const { fromId, toIds } = event;
        return [
            { from: fromId, tos: [toIds[1]] },
            { from: toIds[1], tos: [toIds[0]] },
        ];
    }
    resortTargets() {
        return false;
    }
    async onUse(room, event) {
        event.animation = this.getAnimationSteps(event);
        return true;
    }
    async onEffect(room, skillUseEvent) {
        await room.dropCards(4 /* SelfDrop */, skillUseEvent.cardIds, skillUseEvent.fromId, skillUseEvent.fromId, this.Name);
        const duel = card_1.VirtualCard.create({
            cardName: 'duel',
            bySkill: this.Name,
        });
        await room.useCard({
            fromId: skillUseEvent.toIds[1],
            targetGroup: [[skillUseEvent.toIds[0]]],
            cardId: duel.Id,
        });
        return true;
    }
};
LiJian = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'lijian', description: 'lijian_description' })
], LiJian);
exports.LiJian = LiJian;
