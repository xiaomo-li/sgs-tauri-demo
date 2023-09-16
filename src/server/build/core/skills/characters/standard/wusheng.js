"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WuShengShadow = exports.WuSheng = void 0;
const tslib_1 = require("tslib");
const card_1 = require("core/cards/card");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const game_props_1 = require("core/game/game_props");
const skill_1 = require("core/skills/skill");
let WuSheng = class WuSheng extends skill_1.ViewAsSkill {
    get RelatedCharacters() {
        return ['guanxingzhangbao', 'guansuo'];
    }
    audioIndex(characterName) {
        return characterName && this.RelatedCharacters.includes(characterName) ? 1 : 2;
    }
    canViewAs() {
        return ['slash'];
    }
    canUse(room, owner, event) {
        const identifier = event && event_packer_1.EventPacker.getIdentifier(event);
        if (identifier === 160 /* AskForCardUseEvent */ ||
            identifier === 159 /* AskForCardResponseEvent */) {
            return card_matcher_1.CardMatcher.match(event.cardMatcher, new card_matcher_1.CardMatcher({ generalName: ['slash'] }));
        }
        return owner.canUseCard(room, new card_matcher_1.CardMatcher({ generalName: ['slash'] }));
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    isAvailableCard(room, owner, pendingCardId, selectedCards, containerCard, cardMatcher) {
        const isAvailable = cardMatcher ? cardMatcher.match(new card_matcher_1.CardMatcher({ generalName: ['slash'] })) : true;
        return isAvailable && engine_1.Sanguosha.getCardById(pendingCardId).isRed();
    }
    viewAs(selectedCards) {
        return card_1.VirtualCard.create({
            cardName: 'slash',
            bySkill: this.Name,
        }, selectedCards);
    }
};
WuSheng = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'wusheng', description: 'wusheng_description' })
], WuSheng);
exports.WuSheng = WuSheng;
let WuShengShadow = class WuShengShadow extends skill_1.RulesBreakerSkill {
    breakCardUsableDistance(cardId, room, owner) {
        if (cardId instanceof card_matcher_1.CardMatcher) {
            return cardId.match(new card_matcher_1.CardMatcher({ generalName: ['slash'], suit: [4 /* Diamond */] }))
                ? game_props_1.INFINITE_DISTANCE
                : 0;
        }
        else {
            const card = engine_1.Sanguosha.getCardById(cardId);
            return card.GeneralName === 'slash' && card.Suit === 4 /* Diamond */ ? game_props_1.INFINITE_DISTANCE : 0;
        }
    }
};
WuShengShadow = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.CompulsorySkill({ name: WuSheng.GeneralName, description: WuSheng.Description })
], WuShengShadow);
exports.WuShengShadow = WuShengShadow;
