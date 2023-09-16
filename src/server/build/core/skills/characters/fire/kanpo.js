"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KanPo = void 0;
const tslib_1 = require("tslib");
const card_1 = require("core/cards/card");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
let KanPo = class KanPo extends skill_1.ViewAsSkill {
    get RelatedCharacters() {
        return ['pangtong'];
    }
    canViewAs() {
        return ['wuxiekeji'];
    }
    canUse(room, owner) {
        return owner.canUseCard(room, new card_matcher_1.CardMatcher({ name: ['wuxiekeji'] })) && owner.getPlayerCards().length > 0;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    isAvailableCard(room, owner, pendingCardId) {
        return engine_1.Sanguosha.getCardById(pendingCardId).isBlack();
    }
    viewAs(selectedCards) {
        return card_1.VirtualCard.create({
            cardName: 'wuxiekeji',
            bySkill: this.Name,
        }, selectedCards);
    }
};
KanPo = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'kanpo', description: 'kanpo_description' })
], KanPo);
exports.KanPo = KanPo;
