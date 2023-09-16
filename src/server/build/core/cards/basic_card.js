"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasicCard = void 0;
const card_1 = require("./card");
class BasicCard extends card_1.Card {
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
        this.cardType = [0 /* Basic */];
        this.generalName = generalName || this.name;
    }
    get BaseType() {
        return 0 /* Basic */;
    }
}
exports.BasicCard = BasicCard;
