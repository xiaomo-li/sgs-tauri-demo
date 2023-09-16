"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HuoJi = void 0;
const tslib_1 = require("tslib");
const card_1 = require("core/cards/card");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
let HuoJi = class HuoJi extends skill_1.ViewAsSkill {
    get RelatedCharacters() {
        return ['pangtong'];
    }
    canViewAs() {
        return ['fire_attack'];
    }
    canUse(room, owner) {
        return owner.canUseCard(room, new card_matcher_1.CardMatcher({ name: ['fire_attack'] })) && owner.getPlayerCards().length > 0;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    isAvailableCard(room, owner, pendingCardId) {
        return engine_1.Sanguosha.getCardById(pendingCardId).isRed();
    }
    viewAs(selectedCards) {
        return card_1.VirtualCard.create({
            cardName: 'fire_attack',
            bySkill: this.Name,
        }, selectedCards);
    }
};
HuoJi = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'huoji', description: 'huoji_description' })
], HuoJi);
exports.HuoJi = HuoJi;
