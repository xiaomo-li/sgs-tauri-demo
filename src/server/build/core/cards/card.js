"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VirtualCard = exports.Card = exports.UniqueCard = exports.Globe = exports.Others = exports.Multiple = exports.Single = exports.None = void 0;
const engine_1 = require("core/game/engine");
const algorithm_1 = require("core/shares/libs/algorithm");
const precondition_1 = require("core/shares/libs/precondition/precondition");
const skill_1 = require("core/skills/skill");
function None(constructor) {
    return class extends constructor {
        constructor() {
            super(...arguments);
            this.cardTargetNumber = 0 /* None */;
            this.manualSetCardTargetNumber = 0 /* None */;
        }
    };
}
exports.None = None;
function Single(constructor) {
    return class extends constructor {
        constructor() {
            super(...arguments);
            this.cardTargetNumber = 1 /* Single */;
            this.manualSetCardTargetNumber = 1 /* Single */;
        }
    };
}
exports.Single = Single;
function Multiple(constructor) {
    return class extends constructor {
        constructor() {
            super(...arguments);
            this.cardTargetNumber = 2 /* Multiple */;
            this.manualSetCardTargetNumber = 2 /* Multiple */;
        }
    };
}
exports.Multiple = Multiple;
function Others(constructor) {
    return class extends constructor {
        constructor() {
            super(...arguments);
            this.cardTargetNumber = 3 /* Others */;
            this.manualSetCardTargetNumber = 3 /* Others */;
        }
    };
}
exports.Others = Others;
function Globe(constructor) {
    return class extends constructor {
        constructor() {
            super(...arguments);
            this.cardTargetNumber = 4 /* Globe */;
            this.manualSetCardTargetNumber = 4 /* Globe */;
        }
    };
}
exports.Globe = Globe;
function UniqueCard(option) {
    return (constructor) => class extends constructor {
        generatedBySkill() {
            return option.bySkill;
        }
        isUniqueCard() {
            return true;
        }
    };
}
exports.UniqueCard = UniqueCard;
class Card {
    constructor() {
        this.shadowSkills = [];
        this.cardTargetNumber = 1 /* Single */;
        this.manualSetCardTargetNumber = 1 /* Single */;
    }
    get Reforgeable() {
        return false;
    }
    get Id() {
        return this.id;
    }
    get CardNumber() {
        return this.cardNumber;
    }
    get Suit() {
        return this.suit;
    }
    get Color() {
        if (this.suit === 0 /* NoSuit */) {
            return 2 /* None */;
        }
        else if (this.suit === 3 /* Club */ || this.suit === 1 /* Spade */) {
            return 1 /* Black */;
        }
        return 0 /* Red */;
    }
    get Name() {
        return this.name;
    }
    get GeneralName() {
        return this.generalName;
    }
    get Description() {
        return this.description;
    }
    get Type() {
        return this.cardType;
    }
    get Skill() {
        return this.skill;
    }
    get ShadowSkills() {
        return this.shadowSkills;
    }
    get EffectUseDistance() {
        return this.effectUseDistance;
    }
    hasTransformed() {
        return this.skill instanceof skill_1.ViewAsSkill;
    }
    is(type) {
        return this.cardType.includes(type);
    }
    isUniqueCard() {
        return false;
    }
    isCommonTrick() {
        return false;
    }
    isSameType(card) {
        const intersectionTypes = this.cardType.filter(subType => card.Type.includes(subType));
        return intersectionTypes.length === card.Type.length || intersectionTypes.length === this.cardType.length;
    }
    isBlack() {
        return this.suit === 1 /* Spade */ || this.suit === 3 /* Club */;
    }
    isRed() {
        return this.suit === 2 /* Heart */ || this.suit === 4 /* Diamond */;
    }
    get Package() {
        return this.fromPackage;
    }
    get AOE() {
        return this.manualSetCardTargetNumber;
    }
    set AOE(targetNumber) {
        this.manualSetCardTargetNumber = targetNumber;
    }
    isVirtualCard() {
        return false;
    }
    static isVirtualCardId(id) {
        return typeof id === 'string';
    }
    isWisdomCard() {
        return ['guohechaiqiao', 'wuzhongshengyou', 'wuxiekeji'].includes(this.name);
    }
    equals(card) {
        return this.cardNumber === card.CardNumber && this.suit === card.Suit && this.name === card.Name;
    }
    reset() {
        this.manualSetCardTargetNumber = this.cardTargetNumber;
    }
    generatedBySkill() {
        return undefined;
    }
}
exports.Card = Card;
class VirtualCard extends Card {
    constructor(viewAsOptions, cardIds, skill) {
        super();
        this.cardIds = cardIds;
        this.hideActualCard = false;
        this.id = -1;
        this.viewAsBlackCard = false;
        this.viewAsRedCard = false;
        const { cardName, cardNumber, cardSuit, bySkill, hideActualCard } = viewAsOptions;
        const viewAsCard = engine_1.Sanguosha.getCardByName(cardName);
        precondition_1.Precondition.assert(viewAsCard !== undefined, `Unable to init virtual card: ${cardName}`);
        this.bySkill = bySkill;
        this.fromPackage = viewAsCard.Package;
        this.viewAs = viewAsCard;
        this.cardType = viewAsCard.Type;
        this.AOE = viewAsCard.AOE;
        this.name = this.viewAs.Name;
        this.generalName = this.viewAs.GeneralName;
        this.description = this.viewAs.Description;
        this.skill = skill ? skill : this.viewAs.Skill;
        this.cardType = this.viewAs.Type;
        this.effectUseDistance = this.viewAs.EffectUseDistance;
        this.hideActualCard = !!hideActualCard;
        this.cardNumber = cardNumber;
        if (cardSuit !== undefined) {
            this.suit = cardSuit;
            this.viewAsBlackCard = this.suit === 1 /* Spade */ || this.suit === 3 /* Club */;
            this.viewAsRedCard = this.suit === 2 /* Heart */ || this.suit === 4 /* Diamond */;
        }
        else if (this.cardIds.length === 0) {
            this.viewAsBlackCard = this.suit === 1 /* Spade */ || this.suit === 3 /* Club */;
            this.viewAsRedCard = this.suit === 2 /* Heart */ || this.suit === 4 /* Diamond */;
        }
        else if (this.cardIds.length === 1) {
            const card = engine_1.Sanguosha.getCardById(this.cardIds[0]);
            this.cardNumber = card.CardNumber;
            this.suit = card.Suit;
            this.viewAsBlackCard = this.suit === 1 /* Spade */ || this.suit === 3 /* Club */;
            this.viewAsRedCard = this.suit === 2 /* Heart */ || this.suit === 4 /* Diamond */;
        }
        else {
            this.viewAsBlackCard = true;
            this.viewAsRedCard = true;
            for (const cardId of this.cardIds) {
                const cardSuit = engine_1.Sanguosha.getCardById(cardId).Suit;
                this.viewAsBlackCard = this.viewAsBlackCard && (cardSuit === 1 /* Spade */ || cardSuit === 3 /* Club */);
                this.viewAsRedCard = this.viewAsRedCard && (cardSuit === 2 /* Heart */ || cardSuit === 4 /* Diamond */);
            }
        }
    }
    static parseId(cardId) {
        const parsedId = JSON.parse(cardId.slice(this.virtualIdPrefix.length));
        const skill = parsedId.skillName !== undefined ? engine_1.Sanguosha.getSkillBySkillName(parsedId.skillName) : undefined;
        return VirtualCard.create({
            cardName: parsedId.name,
            cardNumber: parsedId.cardNumber,
            cardSuit: parsedId.cardSuit,
            bySkill: parsedId.bySkill,
            hideActualCard: parsedId.hideActualCard,
        }, parsedId.containedCardIds, skill);
    }
    static create(viewAsOptions, cardIds = [], skill) {
        return new VirtualCard(viewAsOptions, cardIds, skill);
    }
    isBlack() {
        return this.viewAsBlackCard;
    }
    isRed() {
        return this.viewAsRedCard;
    }
    isActualCardHidden() {
        return this.hideActualCard;
    }
    get Suit() {
        return this.suit === undefined ? 0 /* NoSuit */ : this.suit;
    }
    set Suit(suit) {
        this.suit = suit;
    }
    get Color() {
        if (this.viewAsBlackCard) {
            return 1 /* Black */;
        }
        else if (this.viewAsRedCard) {
            return 0 /* Red */;
        }
        return 2 /* None */;
    }
    get CardNumber() {
        return this.cardNumber === undefined ? 0 : this.cardNumber;
    }
    set CardNumber(cardNumber) {
        this.cardNumber = cardNumber;
    }
    get BaseType() {
        return this.viewAs.BaseType;
    }
    get Reforgeable() {
        return this.viewAs.Reforgeable;
    }
    get Id() {
        const virtualCardIdJSONObject = {
            cardNumber: this.cardNumber,
            cardSuit: this.suit,
            name: this.name,
            bySkill: this.bySkill,
            skillName: this.skill.Name,
            containedCardIds: this.cardIds,
            hideActualCard: this.hideActualCard,
        };
        return VirtualCard.virtualIdPrefix + JSON.stringify(virtualCardIdJSONObject);
    }
    get GeneratedBySkill() {
        return this.bySkill;
    }
    get ActualCardIds() {
        return this.cardIds;
    }
    get Skill() {
        return this.skill;
    }
    get ViewAsCard() {
        return this.viewAs;
    }
    isVirtualCard() {
        return true;
    }
    findByGeneratedSkill(skillName) {
        if (this.GeneratedBySkill === skillName) {
            return true;
        }
        if (this.ActualCardIds.length > 0) {
            for (const subCardId of this.ActualCardIds) {
                const subCard = engine_1.Sanguosha.getCardById(subCardId);
                if (subCard.isVirtualCard()) {
                    const subVCard = subCard;
                    if (subVCard.findByGeneratedSkill(skillName)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    static getActualCards(cards, shallow) {
        let result = [];
        for (const card of cards) {
            if (Card.isVirtualCardId(card)) {
                if (shallow) {
                    result.push(...engine_1.Sanguosha.getCardById(card).ActualCardIds);
                }
                else {
                    result = result.concat(VirtualCard.getActualCards(engine_1.Sanguosha.getCardById(card).ActualCardIds));
                }
            }
            else {
                result.push(card);
            }
        }
        return algorithm_1.Algorithm.singleton(result);
    }
    getRealActualCards() {
        const actualCardIds = [];
        if (this.ActualCardIds.length > 0) {
            for (const subCardId of this.ActualCardIds) {
                const subCard = engine_1.Sanguosha.getCardById(subCardId);
                if (subCard.isVirtualCard()) {
                    const subVCard = subCard;
                    actualCardIds.push(...subVCard.getRealActualCards());
                }
                else {
                    actualCardIds.push(subCardId);
                }
            }
        }
        return actualCardIds;
    }
}
exports.VirtualCard = VirtualCard;
VirtualCard.virtualIdPrefix = 'prefix';
