"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardMatcher = void 0;
const card_1 = require("core/cards/card");
const algorithm_1 = require("core/shares/libs/algorithm");
const precondition_1 = require("core/shares/libs/precondition/precondition");
class CardMatcher {
    constructor(matcher) {
        this.matcher = matcher;
        this.reverseMatch = false;
        if (Object.keys(this.matcher).length === 0) {
            this.matchAll = true;
        }
    }
    static addTag(matcher) {
        return Object.assign({ tag: 'card-matcher' }, matcher);
    }
    static match(matcher, card) {
        precondition_1.Precondition.assert(matcher.tag && matcher.tag === 'card-matcher', 'Invalid card matcher props');
        const { suit, cardNumber, name, generalName, type, cards, reverseMatch } = matcher;
        let matched = true;
        let hasMatchedCondition = false;
        if (card instanceof card_1.Card) {
            if (suit) {
                hasMatchedCondition = true;
                matched = matched && suit.includes(card.Suit);
            }
            if (cardNumber) {
                hasMatchedCondition = true;
                matched = matched && cardNumber.includes(card.CardNumber);
            }
            if (name) {
                hasMatchedCondition = true;
                matched = matched && name.includes(card.Name);
            }
            if (generalName) {
                hasMatchedCondition = true;
                matched = matched && generalName.includes(card.GeneralName);
            }
            if (type) {
                hasMatchedCondition = true;
                matched = matched && type.find(subType => card.is(subType)) !== undefined;
            }
            if (cards) {
                hasMatchedCondition = true;
                matched = matched && cards.includes(card.Id);
            }
        }
        else {
            const cardMatcher = card.toSocketPassenger();
            if (suit && cardMatcher.suit) {
                hasMatchedCondition = true;
                matched = matched && cardMatcher.suit.length > 0 && cardMatcher.suit.every(cardSuit => suit.includes(cardSuit));
            }
            if (cardNumber && cardMatcher.cardNumber) {
                hasMatchedCondition = true;
                matched =
                    matched &&
                        cardMatcher.cardNumber.length > 0 &&
                        cardMatcher.cardNumber.every(cardNum => cardNumber.includes(cardNum));
            }
            if (name) {
                if (cardMatcher.name) {
                    hasMatchedCondition = true;
                    matched = matched && cardMatcher.name.length > 0 && algorithm_1.Algorithm.intersection(name, cardMatcher.name).length > 0;
                }
                if (cardMatcher.generalName && cardMatcher.generalName.length > 0) {
                    hasMatchedCondition = true;
                    const allNames = cardMatcher.generalName.reduce((target, currentGeneralName) => {
                        if (this.generalNameMaps[currentGeneralName]) {
                            target.push(...this.generalNameMaps[currentGeneralName]);
                        }
                        else {
                            target.push(currentGeneralName);
                        }
                        return target;
                    }, []);
                    matched = matched && algorithm_1.Algorithm.intersection(allNames, name).length > 0;
                }
            }
            if (generalName) {
                if (cardMatcher.generalName) {
                    hasMatchedCondition = true;
                    matched =
                        matched &&
                            cardMatcher.generalName.length > 0 &&
                            algorithm_1.Algorithm.intersection(generalName, cardMatcher.generalName).length > 0;
                }
                if (cardMatcher.name) {
                    hasMatchedCondition = true;
                    const allNames = generalName.reduce((target, currentGeneralName) => {
                        if (this.generalNameMaps[currentGeneralName]) {
                            target.push(...this.generalNameMaps[currentGeneralName]);
                        }
                        return target;
                    }, []);
                    matched = matched && algorithm_1.Algorithm.intersection(allNames, cardMatcher.name).length > 0;
                }
            }
            if (type && cardMatcher.type) {
                hasMatchedCondition = true;
                matched = matched && cardMatcher.type.length > 0 && cardMatcher.type.every(cardType => type.includes(cardType));
            }
            if (cards && cardMatcher.cards) {
                hasMatchedCondition = true;
                matched =
                    matched && cardMatcher.cards.length > 0 && cardMatcher.cards.every(innerCard => cards.includes(innerCard));
            }
        }
        matched = hasMatchedCondition && matched;
        return reverseMatch ? !matched : matched;
    }
    static notMatch(matcher, card) {
        return !this.match(matcher, card);
    }
    with(matcher) {
        if (this.matchAll) {
            return this;
        }
        matcher = matcher instanceof CardMatcher ? matcher.Matcher : matcher;
        const { suit, cardNumber, name, type, cards } = matcher;
        this.matcher.suit = !this.matcher.suit ? suit : suit ? [...this.matcher.suit, ...suit] : this.matcher.suit;
        this.matcher.cardNumber = !this.matcher.cardNumber
            ? cardNumber
            : cardNumber
                ? [...this.matcher.cardNumber, ...cardNumber]
                : this.matcher.cardNumber;
        this.matcher.name = !this.matcher.name ? name : name ? [...this.matcher.name, ...name] : this.matcher.name;
        this.matcher.type = !this.matcher.type ? type : type ? [...this.matcher.type, ...type] : this.matcher.type;
        this.matcher.cards = !this.matcher.cards ? cards : cards ? [...this.matcher.cards, ...cards] : this.matcher.cards;
        this.matchAll = Object.keys(this.matcher).length === 0;
        return this;
    }
    without(matcher) {
        if (this.matchAll) {
            this.reverseMatch = true;
            for (const [key, value] of Object.entries(matcher)) {
                this.matcher[key] = value;
            }
            this.matchAll = Object.keys(this.matcher).length === 0;
            return this;
        }
        matcher = matcher instanceof CardMatcher ? matcher.Matcher : matcher;
        const { suit, cardNumber, name, type, cards } = matcher;
        this.matcher.suit = !this.matcher.suit
            ? undefined
            : suit
                ? this.matcher.suit.filter(s => !suit.includes(s))
                : this.matcher.suit;
        this.matcher.cardNumber = !this.matcher.cardNumber
            ? undefined
            : cardNumber
                ? this.matcher.cardNumber.filter(s => !cardNumber.includes(s))
                : this.matcher.cardNumber;
        this.matcher.name = !this.matcher.name
            ? undefined
            : name
                ? this.matcher.name.filter(s => !name.includes(s))
                : this.matcher.name;
        this.matcher.type = !this.matcher.type
            ? undefined
            : type
                ? this.matcher.type.filter(s => !type.includes(s))
                : this.matcher.type;
        this.matcher.cards = !this.matcher.cards
            ? undefined
            : cards
                ? this.matcher.cards.filter(s => !cards.includes(s))
                : this.matcher.cards;
        this.matchAll = Object.keys(this.matcher).length === 0;
        return this;
    }
    match(card) {
        return CardMatcher.match(Object.assign({ tag: 'card-matcher', reverseMatch: this.reverseMatch }, this.matcher), card);
    }
    notMatch(card) {
        return !this.match(card);
    }
    get Matcher() {
        return this.matcher;
    }
    toSocketPassenger() {
        return Object.assign(Object.assign({}, this.matcher), { tag: 'card-matcher' });
    }
    toString() {
        return JSON.stringify(this.matcher);
    }
    static parse(cardPattern) {
        return new CardMatcher(JSON.parse(cardPattern));
    }
}
exports.CardMatcher = CardMatcher;
CardMatcher.generalNameMaps = {
    slash: ['slash', 'fire_slash', 'thunder_slash'],
};
