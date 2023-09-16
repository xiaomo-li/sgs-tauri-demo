"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardLoader = void 0;
const character_skills_1 = require("core/cards/character_skills");
const legion_fight_1 = require("core/cards/legion_fight");
const standard_1 = require("core/cards/standard");
const precondition_1 = require("core/shares/libs/precondition/precondition");
const allPackageLoaders = {
    ["standard" /* Standard */]: standard_1.StandardCardPackage,
    ["legion_fight" /* LegionFight */]: legion_fight_1.LegionFightCardPackage,
    ["character_skills" /* CharacterSkills */]: character_skills_1.SkillsGeneratedCardPackage,
};
class CardLoader {
    constructor() {
        this.cards = {};
        this.uniquCards = new Map();
        this.loadCards();
    }
    loadCards() {
        let index = 1;
        for (const [packageName, loader] of Object.entries(allPackageLoaders)) {
            const cards = loader(index);
            this.cards[packageName] = [];
            for (const card of cards) {
                if (!card.isUniqueCard()) {
                    this.cards[packageName].push(card);
                }
                else {
                    const bySkill = precondition_1.Precondition.exists(card.generatedBySkill(), `unknown unique card generator: ${card.Name}`);
                    const cardSet = this.uniquCards.get(bySkill);
                    if (cardSet) {
                        cardSet.push(card);
                    }
                    else {
                        this.uniquCards.set(bySkill, [card]);
                    }
                }
            }
            index += cards.length;
        }
    }
    static getInstance() {
        if (this.instance === undefined) {
            this.instance = new CardLoader();
        }
        return this.instance;
    }
    getAllCards() {
        return Object.values(this.cards).reduce((addedCards, cards) => addedCards.concat(cards), []);
    }
    getPackages(...extensions) {
        return extensions.reduce((addedCards, extension) => addedCards.concat(this.cards[extension]), []);
    }
    getUniquCards() {
        return this.uniquCards;
    }
}
exports.CardLoader = CardLoader;
