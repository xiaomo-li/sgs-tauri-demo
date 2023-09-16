"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QiCe = void 0;
const tslib_1 = require("tslib");
const card_1 = require("core/cards/card");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const engine_1 = require("core/game/engine");
const precondition_1 = require("core/shares/libs/precondition/precondition");
const skill_1 = require("core/skills/skill");
let QiCe = class QiCe extends skill_1.ViewAsSkill {
    canViewAs(room, owner, selectedCards, cardMatcher) {
        return cardMatcher
            ? []
            : engine_1.Sanguosha.getCardNameByType(types => types.includes(7 /* Trick */) && !types.includes(8 /* DelayedTrick */));
    }
    isRefreshAt(room, owner, phase) {
        return phase === 4 /* PlayCardStage */;
    }
    canUse(room, owner) {
        return (!owner.hasUsedSkill(this.Name) &&
            owner.getCardIds(0 /* HandArea */).length > 0 &&
            owner.canUseCard(room, new card_matcher_1.CardMatcher({
                name: engine_1.Sanguosha.getCardNameByType(types => types.includes(7 /* Trick */) && !types.includes(8 /* DelayedTrick */)),
            })));
    }
    cardFilter(room, owner, cards) {
        return cards.length === 0;
    }
    isAvailableCard(room, owner, pendingCardId) {
        return false;
    }
    viewAs(selectedCards, owner, viewAs) {
        precondition_1.Precondition.assert(!!viewAs, 'Unknown qice card');
        return card_1.VirtualCard.create({
            cardName: viewAs,
            bySkill: this.Name,
        }, owner.getCardIds(0 /* HandArea */));
    }
};
QiCe = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'qice', description: 'qice_description' })
], QiCe);
exports.QiCe = QiCe;
