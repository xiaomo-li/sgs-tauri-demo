"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrickCard = exports.DelayedTrick = void 0;
const card_1 = require("./card");
function DelayedTrick(constructor) {
    return class extends constructor {
        constructor() {
            super(...arguments);
            this.cardType = [7 /* Trick */, 8 /* DelayedTrick */];
        }
    };
}
exports.DelayedTrick = DelayedTrick;
class TrickCard extends card_1.Card {
    constructor(id, cardNumber, suit, effectUseDistance, name, description, fromPackage, skill, generalName) {
        super();
        this.id = id;
        this.cardNumber = cardNumber;
        this.suit = suit;
        this.effectUseDistance = effectUseDistance;
        this.name = name;
        this.description = description;
        this.fromPackage = fromPackage;
        this.skill = skill;
        this.cardType = [7 /* Trick */];
        this.generalName = generalName || this.name;
    }
    get BaseType() {
        return 7 /* Trick */;
    }
    isCommonTrick() {
        return !this.cardType.includes(8 /* DelayedTrick */);
    }
    isDelayedTrick() {
        return this.cardType.includes(8 /* DelayedTrick */);
    }
}
exports.TrickCard = TrickCard;
