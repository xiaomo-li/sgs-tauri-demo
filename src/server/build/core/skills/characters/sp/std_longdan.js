"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StdLongDan = void 0;
const tslib_1 = require("tslib");
const card_1 = require("core/cards/card");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
let StdLongDan = class StdLongDan extends skill_1.ViewAsSkill {
    get RelatedCharacters() {
        return ['tongyuan_c'];
    }
    audioIndex(characterName) {
        return characterName && this.RelatedCharacters.includes(characterName) ? 1 : 2;
    }
    canViewAs(room, owner, selectedCards) {
        if (!selectedCards) {
            return ['jink', 'slash'];
        }
        else {
            const card = engine_1.Sanguosha.getCardById(selectedCards[0]);
            if (card.GeneralName === 'slash') {
                return ['jink'];
            }
            if (card.GeneralName === 'jink') {
                return ['slash'];
            }
            return [];
        }
    }
    canUse(room, owner, event) {
        const identifier = event && event_packer_1.EventPacker.getIdentifier(event);
        if (identifier === 160 /* AskForCardUseEvent */ ||
            identifier === 159 /* AskForCardResponseEvent */) {
            return (card_matcher_1.CardMatcher.match(event.cardMatcher, new card_matcher_1.CardMatcher({ generalName: ['slash'] })) ||
                card_matcher_1.CardMatcher.match(event.cardMatcher, new card_matcher_1.CardMatcher({ name: ['jink'] })));
        }
        return owner.canUseCard(room, new card_matcher_1.CardMatcher({ name: ['slash'] }));
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    isAvailableCard(room, owner, pendingCardId, selectedCards, containerCard, cardMatcher) {
        var _a, _b, _c;
        if (cardMatcher) {
            let canUse = false;
            if ((_a = cardMatcher.Matcher.name) === null || _a === void 0 ? void 0 : _a.includes('jink')) {
                canUse = engine_1.Sanguosha.getCardById(pendingCardId).GeneralName === 'slash';
            }
            else if (((_b = cardMatcher.Matcher.name) === null || _b === void 0 ? void 0 : _b.includes('slash')) || ((_c = cardMatcher.Matcher.generalName) === null || _c === void 0 ? void 0 : _c.includes('slash'))) {
                canUse = engine_1.Sanguosha.getCardById(pendingCardId).GeneralName === 'jink';
            }
            return canUse;
        }
        else {
            const card = engine_1.Sanguosha.getCardById(pendingCardId);
            return card.GeneralName === 'jink' && owner.canUseCard(room, new card_matcher_1.CardMatcher({ generalName: ['slash'] }));
        }
    }
    availableCardAreas() {
        return [0 /* HandArea */];
    }
    viewAs(selectedCards) {
        const card = engine_1.Sanguosha.getCardById(selectedCards[0]);
        if (card.GeneralName === 'slash') {
            return card_1.VirtualCard.create({
                cardName: 'jink',
                bySkill: this.Name,
            }, selectedCards);
        }
        else {
            return card_1.VirtualCard.create({
                cardName: 'slash',
                bySkill: this.Name,
            }, selectedCards);
        }
    }
};
StdLongDan = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'std_longdan', description: 'std_longdan_description' })
], StdLongDan);
exports.StdLongDan = StdLongDan;
