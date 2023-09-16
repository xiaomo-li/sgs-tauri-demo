"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LianHuanShadow = exports.LianHuan = void 0;
const tslib_1 = require("tslib");
const card_1 = require("core/cards/card");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
let LianHuan = class LianHuan extends skill_1.ViewAsSkill {
    canViewAs() {
        return ['tiesuolianhuan'];
    }
    canUse(room, owner) {
        return (owner.canUseCard(room, new card_matcher_1.CardMatcher({ name: ['tiesuolianhuan'] })) &&
            owner.getCardIds(0 /* HandArea */).length > 0);
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    isAvailableCard(room, owner, pendingCardId) {
        return engine_1.Sanguosha.getCardById(pendingCardId).Suit === 3 /* Club */;
    }
    availableCardAreas() {
        return [0 /* HandArea */];
    }
    viewAs(selectedCards) {
        return card_1.VirtualCard.create({
            cardName: 'tiesuolianhuan',
            bySkill: this.Name,
        }, selectedCards);
    }
};
LianHuan = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'lianhuan', description: 'lianhuan_description' })
], LianHuan);
exports.LianHuan = LianHuan;
let LianHuanShadow = class LianHuanShadow extends skill_1.RulesBreakerSkill {
    breakCardUsableTargets(cardId, room, owner) {
        if (cardId instanceof card_matcher_1.CardMatcher) {
            return cardId.match(new card_matcher_1.CardMatcher({ name: ['tiesuolianhuan'] })) ? 1 : 0;
        }
        else {
            return engine_1.Sanguosha.getCardById(cardId).GeneralName === 'tiesuolianhuan' ? 1 : 0;
        }
    }
};
LianHuanShadow = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.CommonSkill({ name: LianHuan.GeneralName, description: LianHuan.Description })
], LianHuanShadow);
exports.LianHuanShadow = LianHuanShadow;
