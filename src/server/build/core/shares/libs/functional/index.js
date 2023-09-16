"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Functional = void 0;
const engine_1 = require("core/game/engine");
const precondition_1 = require("../precondition/precondition");
class Functional {
    static getPlayerPhaseRawText(stage) {
        switch (stage) {
            case 0 /* PhaseBegin */:
            case 1 /* PrepareStage */:
                return 'prepare stage';
            case 2 /* JudgeStage */:
                return 'judge stage';
            case 3 /* DrawCardStage */:
                return 'draw stage';
            case 4 /* PlayCardStage */:
                return 'play stage';
            case 5 /* DropCardStage */:
                return 'drop stage';
            case 6 /* FinishStage */:
            case 7 /* PhaseFinish */:
                return 'finish stage';
            default:
                throw precondition_1.Precondition.UnreachableError(stage);
        }
    }
    static getPlayerCardAreaText(area) {
        switch (area) {
            case 1 /* EquipArea */:
                return 'equip area';
            case 0 /* HandArea */:
                return 'hand area';
            case 2 /* JudgeArea */:
                return 'judge area';
            case 3 /* OutsideArea */:
                return 'outside area';
            default:
                throw precondition_1.Precondition.UnreachableError(area);
        }
    }
    static getCardSuitRawText(suit) {
        const cardSuitRawText = ['nosuit', 'spade', 'heart', 'club', 'diamond'];
        return cardSuitRawText[suit];
    }
    static getCardSuitCharText(suit) {
        const cardSuitCharText = ['□', '♠', '♥', '♣', '♦'];
        return cardSuitCharText[suit];
    }
    static getPlayerRoleRawText(role, mode) {
        switch (mode) {
            case "1v2" /* OneVersusTwo */: {
                const playerRoleRawText = {
                    [1 /* Lord */]: 'landowners',
                    [3 /* Rebel */]: 'peasant',
                };
                return playerRoleRawText[role];
            }
            case "2v2" /* TwoVersusTwo */: {
                const playerRoleRawText = {
                    [2 /* Loyalist */]: 'dragon-team',
                    [3 /* Rebel */]: 'tiger-team',
                };
                return playerRoleRawText[role];
            }
            default: {
                const playerRoleRawText = ['unknown', 'lord', 'loyalist', 'rebel', 'renegade'];
                return playerRoleRawText[role];
            }
        }
    }
    static getPlayerNationalityText(nationality) {
        const playerRoleRawText = ['wei', 'shu', 'wu', 'qun', 'god'];
        return playerRoleRawText[nationality];
    }
    static compareCardTypes(cardA, cardB) {
        if (cardB.BaseType === 1 /* Equip */) {
            return -1;
        }
        else if (cardB.BaseType === 0 /* Basic */) {
            return 1;
        }
        else {
            return cardA.BaseType === 1 /* Equip */ ? 1 : -1;
        }
    }
    static sortCards(cardIds) {
        const cards = cardIds.map(id => engine_1.Sanguosha.getCardById(id));
        const sortedCards = [];
        const basicCards = [];
        const trickCards = [];
        const equipCards = [];
        for (const card of cards) {
            if (card.is(0 /* Basic */)) {
                basicCards.push(card);
            }
            else if (card.is(7 /* Trick */)) {
                trickCards.push(card);
            }
            else {
                equipCards.push(card);
            }
        }
        for (const tpyeCards of [basicCards, trickCards, equipCards]) {
            for (const card of tpyeCards) {
                const index = sortedCards.findIndex(id => engine_1.Sanguosha.getCardById(id).Name === card.Name);
                if (index >= 0) {
                    sortedCards.splice(index, 0, card.Id);
                }
                else {
                    sortedCards.push(card.Id);
                }
            }
        }
        return sortedCards;
    }
    static getPlayerNationalityEnum(nationality) {
        switch (nationality) {
            case 'wei': {
                return 0 /* Wei */;
            }
            case 'shu': {
                return 1 /* Shu */;
            }
            case 'wu': {
                return 2 /* Wu */;
            }
            case 'qun': {
                return 3 /* Qun */;
            }
            case 'god': {
                return 4 /* God */;
            }
            default: {
                throw new Error(`Unknown incoming nationality: ${nationality}`);
            }
        }
    }
    static getCardTypeRawText(type) {
        switch (type) {
            case 0 /* Basic */:
                return 'basic card';
            case 1 /* Equip */:
                return 'equip card';
            case 7 /* Trick */:
                return 'trick card';
            case 8 /* DelayedTrick */:
                return 'delayed trick card';
            case 3 /* Shield */:
                return 'armor card';
            case 2 /* Weapon */:
                return 'weapon card';
            case 5 /* DefenseRide */:
                return 'defense ride card';
            case 4 /* OffenseRide */:
                return 'offense ride card';
            case 6 /* Precious */:
                return 'precious card';
            default:
                throw precondition_1.Precondition.UnreachableError(type);
        }
    }
    static getCardBaseTypeAbbrRawText(type) {
        switch (type) {
            case 0 /* Basic */:
                return 'abbr:basic';
            case 7 /* Trick */:
                return 'abbr:trick';
            case 1 /* Equip */:
                return 'abbr:equip';
            default:
                throw new Error(`Cannot get the abbreviated raw text of card type: ${type}`);
        }
    }
    static getCardColorRawText(color) {
        switch (color) {
            case 1 /* Black */:
                return 'black';
            case 0 /* Red */:
                return 'red';
            case 2 /* None */:
                return 'none_color';
            default:
                throw precondition_1.Precondition.UnreachableError(color);
        }
    }
    static getCardNumberRawText(cardNumber) {
        switch (cardNumber) {
            case 1:
                return 'A';
            case 11:
                return 'J';
            case 12:
                return 'Q';
            case 13:
                return 'K';
            default:
                return String(cardNumber);
        }
    }
    static convertEquipSectionAndCardType(equipSectionOrCardType) {
        switch (equipSectionOrCardType) {
            case "weapon section" /* Weapon */:
                return 2 /* Weapon */;
            case "shield section" /* Shield */:
                return 3 /* Shield */;
            case "defense ride section" /* DefenseRide */:
                return 5 /* DefenseRide */;
            case "offense ride section" /* OffenseRide */:
                return 4 /* OffenseRide */;
            case "precious" /* Precious */:
                return 6 /* Precious */;
            case 2 /* Weapon */:
                return "weapon section" /* Weapon */;
            case 3 /* Shield */:
                return "shield section" /* Shield */;
            case 5 /* DefenseRide */:
                return "defense ride section" /* DefenseRide */;
            case 4 /* OffenseRide */:
                return "offense ride section" /* OffenseRide */;
            case 6 /* Precious */:
                return "precious" /* Precious */;
            default:
                throw new Error(`Cannot convert this value: ${equipSectionOrCardType}`);
        }
    }
    static convertSuitStringToSuit(suitStr) {
        switch (suitStr) {
            case 'spade':
                return 1 /* Spade */;
            case 'club':
                return 3 /* Club */;
            case 'diamond':
                return 4 /* Diamond */;
            case 'heart':
                return 2 /* Heart */;
            default:
                throw new Error(`Cannot convert this value: ${suitStr}`);
        }
    }
}
exports.Functional = Functional;
