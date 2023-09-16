"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameCommonRules = void 0;
const card_1 = require("core/cards/card");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const game_props_1 = require("./game_props");
class GameCommonRules {
    constructor() {
        // constructor() {}
        this.commonCardUseRules = [
            {
                cardMatcher: new card_matcher_1.CardMatcher({ generalName: ['slash'] }),
                times: 1,
            },
            {
                cardMatcher: new card_matcher_1.CardMatcher({ name: ['alcohol'] }),
                times: 1,
            },
        ];
        this.isBannedBySideRules = (player, cardOrMatcher) => {
            if (cardOrMatcher instanceof card_1.Card) {
                if (cardOrMatcher.GeneralName === 'peach') {
                    return player.Hp >= player.MaxHp;
                }
            }
            else {
                if (cardOrMatcher.match(new card_matcher_1.CardMatcher({ name: ['peach'] }))) {
                    return player.Hp >= player.MaxHp;
                }
            }
            return false;
        };
        this.userRules = {};
    }
    preCheck(user) {
        if (this.userRules[user.Id] === undefined) {
            this.initPlayerCommonRules(user);
        }
        if (this.userRules[user.Id].cards === undefined) {
            this.userRules[user.Id].cards = [];
        }
    }
    availableUseTimes(card) {
        for (const commonRule of this.commonCardUseRules) {
            if (commonRule.cardMatcher.match(card)) {
                return commonRule.times;
            }
        }
        return game_props_1.INFINITE_TRIGGERING_TIMES;
    }
    initPlayerCommonRules(user) {
        this.userRules[user.Id] = {
            cards: [],
            additionalDefenseDistance: 0,
            additionalOffenseDistance: 0,
            additionalHold: 0,
            additionalAttackDistance: 0,
        };
    }
    checkCardUseDistance(card, user) {
        this.preCheck(user);
    }
    getCardUsableTimes(room, user, card, target) {
        let availableUseTimes = game_props_1.INFINITE_TRIGGERING_TIMES;
        const baseRule = this.commonCardUseRules.find(rule => rule.cardMatcher.match(card));
        if (baseRule) {
            availableUseTimes = baseRule.times;
        }
        const additionalRule = this.userRules[user.Id].cards.filter(rule => rule.cardMatcher.match(card));
        if (additionalRule) {
            availableUseTimes = additionalRule.reduce((total, current) => (total += current.additionalUsableTimes), availableUseTimes);
        }
        for (const skill of user.getSkills('breaker')) {
            availableUseTimes += skill.breakCardUsableTimes(card instanceof card_1.Card ? card.Id : card, room, user);
            if (target) {
                availableUseTimes += skill.breakCardUsableTimesTo(card instanceof card_1.Card ? card.Id : card, room, user, target);
            }
        }
        return availableUseTimes;
    }
    canUseCard(room, user, card) {
        this.preCheck(user);
        const availableUseTimes = this.getCardUsableTimes(room, user, card);
        if (this.isBannedBySideRules(user, card)) {
            return false;
        }
        return user.cardUsedTimes(card instanceof card_1.Card ? card.Id : card) < availableUseTimes;
    }
    canUseCardTo(room, user, card, target) {
        this.preCheck(user);
        const availableUseTimes = this.getCardUsableTimes(room, user, card, target);
        if (this.isBannedBySideRules(user, card)) {
            return false;
        }
        return user.cardUsedTimes(card instanceof card_1.Card ? card.Id : card) < availableUseTimes;
    }
    addAdditionalHoldCardNumber(user, addedNumber) {
        this.preCheck(user);
        this.userRules[user.Id].additionalHold += addedNumber;
    }
    addAdditionalAttackRange(user, addedNumber) {
        this.preCheck(user);
        this.userRules[user.Id].additionalAttackDistance += addedNumber;
    }
    getBaseHoldCardNumber(room, user) {
        let cardHoldNumber = -1;
        user.getSkills('breaker').forEach(skill => {
            const newCardHoldNumber = skill.breakBaseCardHoldNumber(room, user);
            if (newCardHoldNumber > cardHoldNumber) {
                cardHoldNumber = newCardHoldNumber;
            }
        });
        return cardHoldNumber >= 0 ? cardHoldNumber : user.Hp;
    }
    getAdditionalHoldCardNumber(room, user) {
        this.preCheck(user);
        let additionalCardHold = this.userRules[user.Id].additionalHold;
        user.getSkills('breaker').forEach(skill => {
            additionalCardHold += skill.breakAdditionalCardHoldNumber(room, user);
        });
        for (const owner of room.getAlivePlayersFrom()) {
            for (const skill of owner.getSkills('globalBreaker')) {
                additionalCardHold += skill.breakAdditionalCardHold(room, owner, user);
            }
        }
        return additionalCardHold;
    }
    addCardUsableTimes(cardMatcher, times, user) {
        this.preCheck(user);
        const matchedRules = this.userRules[user.Id].cards.filter(cardProp => cardProp.cardMatcher.match(cardMatcher));
        if (matchedRules.length === 0) {
            this.userRules[user.Id].cards.push({
                cardMatcher,
                additionalTargets: 0,
                additionalUsableDistance: 0,
                additionalUsableTimes: times,
            });
        }
        else {
            matchedRules.map(rule => (rule.additionalUsableTimes += times));
        }
    }
    addCardUsableDistance(cardMatcher, times, user) {
        this.preCheck(user);
        this.userRules[user.Id].cards
            .filter(cardProp => cardProp.cardMatcher.match(cardMatcher))
            .map(rule => (rule.additionalUsableDistance += times));
    }
    addAdditionalUsableNumberOfTargets(card, user, additional) {
        this.userRules[user.Id].cards
            .filter(rule => rule.cardMatcher.match(card))
            .map(rule => (rule.additionalTargets += additional));
    }
    addNewCardRules(rule, user) {
        this.preCheck(user);
        this.userRules[user.Id].cards.push(rule);
    }
    removeCardRules(cardMatcher, user) {
        this.userRules[user.Id].cards = this.userRules[user.Id].cards.filter(rule => rule.cardMatcher.match(cardMatcher));
    }
    getCardAdditionalUsableDistance(room, user, card, target) {
        this.preCheck(user);
        let times = 0;
        if (card !== undefined) {
            this.userRules[user.Id].cards
                .filter(rule => rule.cardMatcher.match(card))
                .forEach(rule => {
                times += rule.additionalUsableDistance;
            });
        }
        user.getSkills('breaker').forEach(skill => {
            times +=
                skill.breakCardUsableDistance(card instanceof card_1.Card ? card.Id : card, room, user) +
                    (target ? skill.breakCardUsableDistanceTo(card instanceof card_1.Card ? card.Id : card, room, user, target) : 0);
        });
        for (const player of room.getAlivePlayersFrom()) {
            let count = 0;
            player.getSkills('globalBreaker').forEach(skill => {
                count += skill.breakGlobalCardUsableDistance(card instanceof card_1.Card ? card.Id : card, room, player, user);
            });
            times += count;
        }
        return times;
    }
    getCardAdditionalNumberOfTargets(room, user, card) {
        this.preCheck(user);
        let times = 0;
        this.userRules[user.Id].cards
            .filter(rule => rule.cardMatcher.match(card))
            .forEach(rule => {
            times += rule.additionalTargets;
        });
        user.getSkills('breaker').forEach(skill => {
            times += skill.breakCardUsableTargets(card instanceof card_1.Card ? card.Id : card, room, user);
        });
        return times;
    }
    getAdditionalAttackDistance(user) {
        this.preCheck(user);
        return this.userRules[user.Id].additionalAttackDistance;
    }
    getCardAdditionalAttackDistance(room, user, card, target) {
        this.preCheck(user);
        let distance = this.userRules[user.Id].additionalAttackDistance;
        user.getSkills('breaker').forEach(skill => {
            distance += skill.breakAttackDistance(card instanceof card_1.Card ? card.Id : card, room, user);
        });
        return distance;
    }
    getAdditionalOffenseDistance(room, user) {
        this.preCheck(user);
        let distance = this.userRules[user.Id].additionalOffenseDistance;
        user.getSkills('breaker').forEach(skill => {
            distance += skill.breakOffenseDistance(room, user);
        });
        return distance;
    }
    getAdditionalDefenseDistance(room, user) {
        this.preCheck(user);
        let distance = this.userRules[user.Id].additionalDefenseDistance;
        user.getSkills('breaker').forEach(skill => {
            distance += skill.breakDefenseDistance(room, user);
        });
        return distance;
    }
    toSocketObject(user) {
        this.preCheck(user);
        const rule = this.userRules[user.Id];
        const cardRules = rule.cards.map(cardRule => (Object.assign(Object.assign({}, cardRule), { cardMatcher: cardRule.cardMatcher.toSocketPassenger() })));
        return Object.assign(Object.assign({}, rule), { cards: cardRules });
    }
    syncSocketObject(user, ruleObject) {
        if (this.userRules[user.Id] === undefined) {
            this.initPlayerCommonRules(user);
        }
        const rule = this.userRules[user.Id];
        rule.additionalAttackDistance = ruleObject.additionalAttackDistance;
        rule.additionalDefenseDistance = ruleObject.additionalDefenseDistance;
        rule.additionalHold = ruleObject.additionalHold;
        rule.additionalOffenseDistance = ruleObject.additionalOffenseDistance;
        rule.cards = ruleObject.cards.map(cardRule => (Object.assign(Object.assign({}, cardRule), { cardMatcher: new card_matcher_1.CardMatcher(cardRule.cardMatcher) })));
    }
}
exports.GameCommonRules = GameCommonRules;
