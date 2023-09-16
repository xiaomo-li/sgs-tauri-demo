"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JiBingShadow = exports.JiBing = void 0;
const tslib_1 = require("tslib");
const card_1 = require("core/cards/card");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let JiBing = class JiBing extends skill_1.ViewAsSkill {
    canViewAs() {
        return ['slash', 'jink'];
    }
    canUse(room, owner, event) {
        if (owner.getCardIds(3 /* OutsideArea */, this.Name).length === 0) {
            return false;
        }
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
        return (owner.getCardIds(3 /* OutsideArea */, this.Name).includes(pendingCardId) &&
            (!!cardMatcher || owner.canUseCard(room, new card_matcher_1.CardMatcher({ generalName: ['slash'] }))));
    }
    availableCardAreas() {
        return [3 /* OutsideArea */];
    }
    viewAs(selectedCards, owner, viewAs) {
        return card_1.VirtualCard.create({
            cardName: viewAs,
            bySkill: this.Name,
        }, selectedCards);
    }
};
JiBing = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'jibing', description: 'jibing_description' })
], JiBing);
exports.JiBing = JiBing;
let JiBingShadow = class JiBingShadow extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "BeforeDrawCardEffect" /* BeforeDrawCardEffect */;
    }
    canUse(room, owner, content) {
        return (owner.Id === content.fromId &&
            room.CurrentPlayerPhase === 3 /* DrawCardStage */ &&
            content.bySpecialReason === 0 /* GameStage */ &&
            content.drawAmount > 0 &&
            owner.getCardIds(3 /* OutsideArea */, this.GeneralName).length <
                room.AlivePlayers.reduce((allNations, player) => {
                    if (!allNations.includes(player.Nationality)) {
                        allNations.push(player.Nationality);
                    }
                    return allNations;
                }, []).length);
    }
    getSkillLog(room, owner) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to put 2 cards from the top of draw stack on your general card as ‘Bing’?', this.GeneralName).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        event.triggeredOnEvent.drawAmount = 0;
        const topCard = room.getCards(2, 'top');
        await room.moveCards({
            movingCards: topCard.map(card => ({ card, fromArea: 0 /* HandArea */ })),
            toId: event.fromId,
            toArea: 3 /* OutsideArea */,
            moveReason: 2 /* ActiveMove */,
            toOutsideArea: this.GeneralName,
            isOutsideAreaInPublic: true,
            proposer: event.fromId,
            movedByReason: this.GeneralName,
        });
        return true;
    }
};
JiBingShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.CommonSkill({ name: JiBing.Name, description: JiBing.Description })
], JiBingShadow);
exports.JiBingShadow = JiBingShadow;
