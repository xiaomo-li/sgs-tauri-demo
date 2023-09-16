"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeiJing = void 0;
const tslib_1 = require("tslib");
const card_1 = require("core/cards/card");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let WeiJing = class WeiJing extends skill_1.ViewAsSkill {
    canViewAs() {
        return ['jink', 'slash'];
    }
    canUse(room, owner, event) {
        if (owner.hasUsedSkill(this.Name)) {
            return false;
        }
        const identifier = event && event_packer_1.EventPacker.getIdentifier(event);
        if (identifier === 160 /* AskForCardUseEvent */) {
            return (card_matcher_1.CardMatcher.match(event.cardMatcher, new card_matcher_1.CardMatcher({ generalName: ['slash'] })) ||
                card_matcher_1.CardMatcher.match(event.cardMatcher, new card_matcher_1.CardMatcher({ name: ['jink'] })));
        }
        return (owner.canUseCard(room, new card_matcher_1.CardMatcher({ name: ['slash'] })) &&
            identifier !== 159 /* AskForCardResponseEvent */);
    }
    cardFilter(room, owner, cards) {
        return cards.length === 0;
    }
    isAvailableCard() {
        return false;
    }
    viewAs(selectedCards, owner, viewAs) {
        return card_1.VirtualCard.create({
            cardName: viewAs,
            bySkill: this.Name,
        });
    }
};
WeiJing = tslib_1.__decorate([
    skill_wrappers_1.CircleSkill,
    skill_wrappers_1.CommonSkill({ name: 'weijing', description: 'weijing_description' })
], WeiJing);
exports.WeiJing = WeiJing;
