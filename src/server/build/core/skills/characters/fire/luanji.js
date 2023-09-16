"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LuanJiShadow = exports.LuanJi = void 0;
const tslib_1 = require("tslib");
const card_1 = require("core/cards/card");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const engine_1 = require("core/game/engine");
const target_group_1 = require("core/shares/libs/utils/target_group");
const skill_1 = require("core/skills/skill");
let LuanJi = class LuanJi extends skill_1.ViewAsSkill {
    canViewAs() {
        return ['wanjianqifa'];
    }
    canUse(room, owner) {
        return (owner.canUseCard(room, new card_matcher_1.CardMatcher({ name: ['wanjianqifa'] })) &&
            owner.getCardIds(0 /* HandArea */).length >= 2);
    }
    cardFilter(room, owner, cards) {
        return cards.length === 2;
    }
    isAvailableCard(room, owner, pendingCardId, selectedCards) {
        if (selectedCards.length === 1) {
            const pendingCard = engine_1.Sanguosha.getCardById(pendingCardId);
            const selectedCard = engine_1.Sanguosha.getCardById(selectedCards[0]);
            return (owner.cardFrom(pendingCardId) === 0 /* HandArea */ &&
                pendingCard.Suit === selectedCard.Suit &&
                pendingCard !== selectedCard);
        }
        return selectedCards.length < 2;
    }
    availableCardAreas() {
        return [0 /* HandArea */];
    }
    viewAs(selectedCards) {
        return card_1.VirtualCard.create({
            cardName: 'wanjianqifa',
            bySkill: this.Name,
        }, selectedCards);
    }
};
LuanJi = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'luanji', description: 'luanji_description' })
], LuanJi);
exports.LuanJi = LuanJi;
let LuanJiShadow = class LuanJiShadow extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterCardTargetDeclared" /* AfterCardTargetDeclared */;
    }
    canUse(room, owner, event) {
        if (owner.getFlag(this.GeneralName) !== undefined) {
            room.removeFlag(owner.Id, this.GeneralName);
        }
        const canUse = owner === room.getPlayerById(event.fromId) &&
            engine_1.Sanguosha.getCardById(event.cardId).GeneralName === 'wanjianqifa' &&
            event.targetGroup !== undefined &&
            event.targetGroup.length > 1;
        if (canUse) {
            room.setFlag(owner.Id, this.GeneralName, target_group_1.TargetGroupUtil.getRealTargets(event.targetGroup));
        }
        return canUse;
    }
    targetFilter(room, owner, targets) {
        return targets.length === 1;
    }
    isAvailableTarget(owner, room, target) {
        const toIds = room.getPlayerById(owner).getFlag(this.GeneralName);
        return toIds.includes(target);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { triggeredOnEvent, toIds } = event;
        const cardUseEvent = triggeredOnEvent;
        target_group_1.TargetGroupUtil.removeTarget(cardUseEvent.targetGroup, toIds[0]);
        return true;
    }
};
LuanJiShadow = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.CommonSkill({ name: LuanJi.GeneralName, description: LuanJi.Description })
], LuanJiShadow);
exports.LuanJiShadow = LuanJiShadow;
