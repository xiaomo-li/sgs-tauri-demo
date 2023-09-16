"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QiSheShadow = exports.QiShe = void 0;
const tslib_1 = require("tslib");
const card_1 = require("core/cards/card");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let QiShe = class QiShe extends skill_1.ViewAsSkill {
    canViewAs() {
        return ['alcohol'];
    }
    canUse(room, owner) {
        return owner.canUseCard(room, new card_matcher_1.CardMatcher({ name: ['alcohol'] })) && owner.getPlayerCards().length > 0;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    isAvailableCard(room, owner, pendingCardId) {
        return engine_1.Sanguosha.getCardById(pendingCardId).is(1 /* Equip */);
    }
    viewAs(selectedCards) {
        return card_1.VirtualCard.create({
            cardName: 'alcohol',
            bySkill: this.Name,
        }, selectedCards);
    }
};
QiShe = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'qishe', description: 'qishe_description' })
], QiShe);
exports.QiShe = QiShe;
let QiSheShadow = class QiSheShadow extends skill_1.RulesBreakerSkill {
    breakAdditionalCardHoldNumber(room, owner) {
        return owner.getCardIds(1 /* EquipArea */).length;
    }
};
QiSheShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.CommonSkill({ name: QiShe.Name, description: QiShe.Description })
], QiSheShadow);
exports.QiSheShadow = QiSheShadow;
