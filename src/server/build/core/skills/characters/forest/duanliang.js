"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DuanLiangShadow = exports.DuanLiang = void 0;
const tslib_1 = require("tslib");
const card_1 = require("core/cards/card");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const engine_1 = require("core/game/engine");
const game_props_1 = require("core/game/game_props");
const skill_1 = require("core/skills/skill");
let DuanLiang = class DuanLiang extends skill_1.ViewAsSkill {
    canViewAs() {
        return ['bingliangcunduan'];
    }
    canUse(room, owner) {
        return owner.canUseCard(room, new card_matcher_1.CardMatcher({ name: ['bingliangcunduan'] }));
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    isAvailableCard(room, owner, pendingCardId, selectedCards, containerCard, cardMatcher) {
        const card = engine_1.Sanguosha.getCardById(pendingCardId);
        const isAvailable = cardMatcher
            ? cardMatcher.match(new card_matcher_1.CardMatcher({ type: [0 /* Basic */] })) ||
                cardMatcher.match(new card_matcher_1.CardMatcher({ type: [1 /* Equip */] }))
            : card.is(0 /* Basic */) || card.is(1 /* Equip */);
        return isAvailable && card.isBlack();
    }
    viewAs(selectedCards) {
        return card_1.VirtualCard.create({
            cardName: 'bingliangcunduan',
            bySkill: this.Name,
        }, selectedCards);
    }
};
DuanLiang = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'duanliang', description: 'duanliang_description' })
], DuanLiang);
exports.DuanLiang = DuanLiang;
let DuanLiangShadow = class DuanLiangShadow extends skill_1.RulesBreakerSkill {
    breakCardUsableDistanceTo(cardId, room, owner, target) {
        if (owner.getCardIds(0 /* HandArea */).length > target.getCardIds(0 /* HandArea */).length) {
            return 0;
        }
        if (cardId instanceof card_matcher_1.CardMatcher) {
            return cardId.match(new card_matcher_1.CardMatcher({ name: ['bingliangcunduan'] })) ? game_props_1.INFINITE_DISTANCE : 0;
        }
        else {
            const card = engine_1.Sanguosha.getCardById(cardId);
            return card.GeneralName === 'bingliangcunduan' ? game_props_1.INFINITE_DISTANCE : 0;
        }
    }
};
DuanLiangShadow = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.CommonSkill({ name: DuanLiang.Name, description: DuanLiang.Description })
], DuanLiangShadow);
exports.DuanLiangShadow = DuanLiangShadow;
