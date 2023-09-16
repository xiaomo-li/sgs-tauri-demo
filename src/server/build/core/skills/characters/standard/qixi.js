"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QiXi = void 0;
const tslib_1 = require("tslib");
const card_1 = require("core/cards/card");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
let QiXi = class QiXi extends skill_1.ViewAsSkill {
    get RelatedCharacters() {
        return ['heqi'];
    }
    audioIndex(characterName) {
        return characterName && this.RelatedCharacters.includes(characterName) ? 1 : 2;
    }
    canViewAs() {
        return ['guohechaiqiao'];
    }
    canUse(room, owner) {
        return owner.canUseCard(room, new card_matcher_1.CardMatcher({ name: this.canViewAs() }));
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    isAvailableCard(room, owner, pendingCardId, selectedCards, containerCard) {
        return engine_1.Sanguosha.getCardById(pendingCardId).isBlack();
    }
    viewAs(selectedCards) {
        return card_1.VirtualCard.create({
            cardName: 'guohechaiqiao',
            bySkill: this.Name,
        }, selectedCards);
    }
};
QiXi = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'qixi', description: 'qixi_description' })
], QiXi);
exports.QiXi = QiXi;
