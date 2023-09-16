"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QingGuo = void 0;
const tslib_1 = require("tslib");
const card_1 = require("core/cards/card");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
let QingGuo = class QingGuo extends skill_1.ViewAsSkill {
    canViewAs() {
        return ['jink'];
    }
    canUse(room, owner) {
        return owner.canUseCard(room, new card_matcher_1.CardMatcher({ name: ['jink'] }));
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    isAvailableCard(room, owner, pendingCardId) {
        return engine_1.Sanguosha.getCardById(pendingCardId).isBlack();
    }
    availableCardAreas() {
        return [0 /* HandArea */];
    }
    viewAs(selectedCards) {
        return card_1.VirtualCard.create({
            cardName: 'jink',
            bySkill: this.Name,
        }, selectedCards);
    }
};
QingGuo = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'qingguo', description: 'qingguo_description' })
], QingGuo);
exports.QingGuo = QingGuo;
