"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LongHunBlackEffect = exports.LongHunEffect = exports.LongHun = void 0;
const tslib_1 = require("tslib");
const card_1 = require("core/cards/card");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let LongHun = class LongHun extends skill_1.ViewAsSkill {
    canViewAs(room, owner, selectedCards) {
        if (!selectedCards) {
            return ['jink', 'slash', 'wuxiekeji', 'peach'];
        }
        else {
            const cardOne = engine_1.Sanguosha.getCardById(selectedCards[0]);
            const cardTwo = selectedCards.length > 1 ? engine_1.Sanguosha.getCardById(selectedCards[1]) : undefined;
            if (cardTwo && cardTwo.Suit !== cardOne.Suit) {
                return [];
            }
            if (cardOne.Suit === 3 /* Club */) {
                return ['jink'];
            }
            if (cardOne.Suit === 4 /* Diamond */) {
                return ['slash'];
            }
            if (cardOne.Suit === 2 /* Heart */) {
                return ['peach'];
            }
            if (cardOne.Suit === 1 /* Spade */) {
                return ['wuxiekeji'];
            }
            return [];
        }
    }
    canUse(room, owner) {
        return (owner.getPlayerCards().length > 0 &&
            (owner.canUseCard(room, new card_matcher_1.CardMatcher({ generalName: ['slash'] })) ||
                owner.canUseCard(room, new card_matcher_1.CardMatcher({ name: ['peach'] }))));
    }
    cardFilter(room, owner, cards) {
        return cards.length >= 1 && cards.length <= 2;
    }
    isAvailableCard(room, owner, pendingCardId, selectedCards, containerCard, cardMatcher) {
        var _a, _b, _c, _d, _e;
        if (selectedCards.length === 0) {
            if (cardMatcher) {
                let canUse = false;
                if ((_a = cardMatcher.Matcher.name) === null || _a === void 0 ? void 0 : _a.includes('jink')) {
                    canUse = engine_1.Sanguosha.getCardById(pendingCardId).Suit === 3 /* Club */;
                }
                else if (((_b = cardMatcher.Matcher.name) === null || _b === void 0 ? void 0 : _b.includes('slash')) || ((_c = cardMatcher.Matcher.generalName) === null || _c === void 0 ? void 0 : _c.includes('slash'))) {
                    canUse = engine_1.Sanguosha.getCardById(pendingCardId).Suit === 4 /* Diamond */;
                }
                else if ((_d = cardMatcher.Matcher.name) === null || _d === void 0 ? void 0 : _d.includes('peach')) {
                    canUse = engine_1.Sanguosha.getCardById(pendingCardId).Suit === 2 /* Heart */;
                }
                else if ((_e = cardMatcher.Matcher.name) === null || _e === void 0 ? void 0 : _e.includes('wuxiekeji')) {
                    canUse = engine_1.Sanguosha.getCardById(pendingCardId).Suit === 1 /* Spade */;
                }
                return canUse;
            }
            else {
                const card = engine_1.Sanguosha.getCardById(pendingCardId);
                if (card.Suit === 4 /* Diamond */) {
                    return owner.canUseCard(room, new card_matcher_1.CardMatcher({ generalName: ['slash'] }));
                }
                else if (card.Suit === 2 /* Heart */) {
                    return owner.canUseCard(room, new card_matcher_1.CardMatcher({ name: ['peach'] }));
                }
                return false;
            }
        }
        else {
            return engine_1.Sanguosha.getCardById(pendingCardId).Suit === engine_1.Sanguosha.getCardById(selectedCards[0]).Suit;
        }
    }
    viewAs(selectedCards) {
        const suit = engine_1.Sanguosha.getCardById(selectedCards[0]).Suit;
        let cardName;
        switch (suit) {
            case 1 /* Spade */:
                cardName = 'wuxiekeji';
                break;
            case 3 /* Club */:
                cardName = 'jink';
                break;
            case 2 /* Heart */:
                cardName = 'peach';
                break;
            case 4 /* Diamond */:
                cardName = 'fire_slash';
                break;
            default:
                throw new Error('Unknown longhun card');
        }
        return card_1.VirtualCard.create({
            cardName: cardName,
            bySkill: this.Name,
        }, selectedCards);
    }
};
LongHun = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'longhun', description: 'longhun_description' })
], LongHun);
exports.LongHun = LongHun;
let LongHunEffect = class LongHunEffect extends skill_1.TriggerSkill {
    isAutoTrigger() {
        return true;
    }
    isTriggerable(content, stage) {
        return stage === "OnDamageConfirmed" /* OnDamageConfirmed */ || stage === "BeforeRecoverEffect" /* BeforeRecoverEffect */;
    }
    async onTrigger(room, event) {
        event.translationsMessage = translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} triggered skill {1}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(event.fromId)), this.Name).extract();
        return true;
    }
    canUse(room, owner, content) {
        const identifier = event_packer_1.EventPacker.getIdentifier(content);
        if (identifier === 137 /* DamageEvent */) {
            const event = content;
            if (event.fromId !== owner.Id || event.cardIds === undefined || event.isFromChainedDamage) {
                return false;
            }
            const card = engine_1.Sanguosha.getCardById(event.cardIds[0]);
            return (card.isVirtualCard() &&
                card.findByGeneratedSkill(this.GeneralName) &&
                card.ActualCardIds.length === 2 &&
                card.isRed());
        }
        else {
            const event = content;
            if (event.recoverBy !== owner.Id || event.cardIds === undefined) {
                return false;
            }
            const card = engine_1.Sanguosha.getCardById(event.cardIds[0]);
            return (card.isVirtualCard() &&
                card.findByGeneratedSkill(this.GeneralName) &&
                card.ActualCardIds.length === 2 &&
                card.isRed());
        }
    }
    async onEffect(room, event) {
        const { triggeredOnEvent } = event;
        const identifier = event_packer_1.EventPacker.getIdentifier(triggeredOnEvent);
        if (identifier === 137 /* DamageEvent */) {
            const event = triggeredOnEvent;
            event.damage++;
        }
        else {
            const event = triggeredOnEvent;
            event.recoveredHp++;
        }
        return true;
    }
};
LongHunEffect = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.CommonSkill({ name: LongHun.Name, description: LongHun.Description })
], LongHunEffect);
exports.LongHunEffect = LongHunEffect;
let LongHunBlackEffect = class LongHunBlackEffect extends skill_1.TriggerSkill {
    isTriggerable(content, stage) {
        return stage === "CardUsing" /* CardUsing */;
    }
    async onTrigger(room, event) {
        event.translationsMessage = translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} triggered skill {1}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(event.fromId)), this.Name).extract();
        return true;
    }
    canUse(room, owner, content) {
        if (!card_1.Card.isVirtualCardId(content.cardId) || room.CurrentPlayer.getPlayerCards().length === 0) {
            return false;
        }
        const card = engine_1.Sanguosha.getCardById(content.cardId);
        return (card.isVirtualCard() &&
            card.findByGeneratedSkill(this.GeneralName) &&
            card.ActualCardIds.length === 2 &&
            card.isBlack());
    }
    async onEffect(room, event) {
        const askForDropCard = {
            fromId: event.fromId,
            toId: room.CurrentPlayer.Id,
            options: {
                [0 /* HandArea */]: room.CurrentPlayer.getCardIds(0 /* HandArea */).length,
                [1 /* EquipArea */]: room.CurrentPlayer.getCardIds(1 /* EquipArea */),
            },
            triggeredBySkills: [this.Name],
        };
        room.notify(170 /* AskForChoosingCardFromPlayerEvent */, event_packer_1.EventPacker.createUncancellableEvent(askForDropCard), event.fromId);
        const { selectedCard } = await room.onReceivingAsyncResponseFrom(170 /* AskForChoosingCardFromPlayerEvent */, event.fromId);
        let cardId;
        if (selectedCard === undefined) {
            const cardIds = room.CurrentPlayer.getCardIds(0 /* HandArea */);
            cardId = cardIds[Math.floor(Math.random() * cardIds.length)];
        }
        else {
            cardId = selectedCard;
        }
        await room.dropCards(5 /* PassiveDrop */, [cardId], room.CurrentPlayer.Id, event.fromId, this.GeneralName);
        return true;
    }
};
LongHunBlackEffect = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.CommonSkill({ name: LongHunEffect.Name, description: LongHunEffect.Description })
], LongHunBlackEffect);
exports.LongHunBlackEffect = LongHunBlackEffect;
