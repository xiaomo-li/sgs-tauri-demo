"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JiXi = void 0;
const tslib_1 = require("tslib");
const card_1 = require("core/cards/card");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const skill_1 = require("core/skills/skill");
const tuntian_1 = require("./tuntian");
let JiXi = class JiXi extends skill_1.ViewAsSkill {
    canViewAs() {
        return ['shunshouqianyang'];
    }
    canUse(room, owner) {
        return (owner.canUseCard(room, new card_matcher_1.CardMatcher({ name: this.canViewAs() })) &&
            owner.getCardIds(3 /* OutsideArea */, tuntian_1.TunTian.Name).length > 0);
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    isAvailableCard(room, owner, pendingCardId) {
        return owner.getCardIds(3 /* OutsideArea */, tuntian_1.TunTian.Name).includes(pendingCardId);
    }
    availableCardAreas() {
        return [3 /* OutsideArea */];
    }
    viewAs(selectedCards) {
        return card_1.VirtualCard.create({
            cardName: 'shunshouqianyang',
            bySkill: this.Name,
        }, selectedCards);
    }
};
JiXi = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'jixi', description: 'jixi_description' })
], JiXi);
exports.JiXi = JiXi;
