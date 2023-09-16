"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZhangBaSheMaoSkill = void 0;
const tslib_1 = require("tslib");
const card_1 = require("core/cards/card");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const skill_1 = require("core/skills/skill");
let ZhangBaSheMaoSkill = class ZhangBaSheMaoSkill extends skill_1.ViewAsSkill {
    get Muted() {
        return true;
    }
    canViewAs() {
        return ['slash'];
    }
    canUse(room, owner) {
        return owner.canUseCard(room, new card_matcher_1.CardMatcher({ generalName: ['slash'] }));
    }
    cardFilter(room, owner, cards) {
        return cards.length === 2;
    }
    isAvailableCard(room, owner, pendingCardId, selectedCards, containerCard) {
        return pendingCardId !== containerCard;
    }
    availableCardAreas() {
        return [0 /* HandArea */];
    }
    viewAs(selectedCards) {
        return card_1.VirtualCard.create({
            cardName: 'slash',
            bySkill: this.Name,
        }, selectedCards);
    }
};
ZhangBaSheMaoSkill = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'zhangbashemao', description: 'zhangbashemao_description' })
], ZhangBaSheMaoSkill);
exports.ZhangBaSheMaoSkill = ZhangBaSheMaoSkill;
