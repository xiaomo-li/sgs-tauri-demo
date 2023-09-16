"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sanguosha = void 0;
const card_1 = require("core/cards/card");
const precondition_1 = require("core/shares/libs/precondition/precondition");
const skill_1 = require("core/skills/skill");
const loader_cards_1 = require("./package_loader/loader.cards");
const loader_characters_1 = require("./package_loader/loader.characters");
const loader_skills_1 = require("./package_loader/loader.skills");
const version_1 = require("./version");
class Sanguosha {
    static parseCoreVersion() {
        Sanguosha.version = version_1.coreVersion;
        const [major, ,] = version_1.coreVersion.split('.');
        if (major === '0') {
            Sanguosha.version += ' Alpha';
        }
    }
    static tryToThrowUninitializedError() {
        precondition_1.Precondition.assert(!!Sanguosha.skills && !!Sanguosha.cards && !!Sanguosha.characters, 'Uninitialized game engine');
    }
    static initialize() {
        if (this.hasInitialized) {
            return;
        }
        this.hasInitialized = true;
        for (const skill of loader_skills_1.SkillLoader.getInstance().getAllSkills()) {
            Sanguosha.skills[skill.Name] = skill;
            if (skill instanceof skill_1.TransformSkill) {
                this.transformSkills.push(skill.Name);
            }
        }
        Sanguosha.cards = loader_cards_1.CardLoader.getInstance().getAllCards();
        Sanguosha.uniquCardMaps = loader_cards_1.CardLoader.getInstance().getUniquCards();
        Sanguosha.characters = loader_characters_1.CharacterLoader.getInstance().getAllCharacters();
        Sanguosha.parseCoreVersion();
        for (const card of this.cards) {
            if (!(card.Name in this.cardCategories)) {
                this.cardCategories[card.Name] = card.Type;
            }
        }
    }
    static isTransformCardSill(skillName) {
        return this.transformSkills.includes(skillName);
    }
    static getCardTypeByName(cardName) {
        return this.cardCategories[cardName];
    }
    static getCardNameByType(finder) {
        const results = [];
        for (const [cardName, types] of Object.entries(this.cardCategories)) {
            if (finder(types)) {
                results.push(cardName);
            }
        }
        return results;
    }
    static loadCards(...cards) {
        return Sanguosha.cards.filter(card => cards.includes(card.Package));
    }
    static loadCharacters(disabledCharacters = [], ...characters) {
        return Sanguosha.characters.filter(character => characters.includes(character.Package) && !disabledCharacters.includes(character.Id));
    }
    static getCharacterById(characterId) {
        this.tryToThrowUninitializedError();
        const character = Sanguosha.characters[characterId];
        return precondition_1.Precondition.exists(character, `Unable to find the card by id: ${characterId}`);
    }
    static getCharacterByExtensions(extensions, exclude) {
        this.tryToThrowUninitializedError();
        return loader_characters_1.CharacterLoader.getInstance().getPackages(...extensions);
    }
    static getVirtualCardById(cardId) {
        return card_1.VirtualCard.parseId(cardId);
    }
    static getCardById(cardId) {
        this.tryToThrowUninitializedError();
        if (typeof cardId === 'string') {
            return this.getVirtualCardById(cardId);
        }
        // const card = Sanguosha.cards.find(card => card.Id === cardId) as T | undefined;
        let card = Sanguosha.cards[cardId - 1];
        if (card) {
            return card;
        }
        else {
            for (const cards of this.uniquCardMaps.values()) {
                card = cards.find(c => c.Id === cardId);
                if (card) {
                    return card;
                }
            }
        }
        throw new Error(`Unable to find the card by id: ${cardId}`);
    }
    static getCardsByMatcher(matcher) {
        return Sanguosha.cards.filter(card => matcher.match(card));
    }
    static getCardByName(cardName) {
        this.tryToThrowUninitializedError();
        let card = Sanguosha.cards.find(card => card.Name === cardName);
        if (card) {
            return card;
        }
        else {
            for (const cards of this.uniquCardMaps.values()) {
                card = cards.find(c => c.Name === cardName);
                if (card) {
                    return card;
                }
            }
        }
        throw new Error(`Unable to find the card by name: ${cardName}`);
    }
    static getSkillGeneratedCards(bySkill) {
        return (Sanguosha.uniquCardMaps.get(bySkill) || []);
    }
    static isCardGeneratedBySkill(card) {
        for (const [skillName, cards] of Object.entries(Sanguosha.uniquCardMaps)) {
            if (cards.includes(card)) {
                return skillName;
            }
        }
    }
    static getSkillBySkillName(name) {
        this.tryToThrowUninitializedError();
        const skill = Sanguosha.skills[name];
        return precondition_1.Precondition.exists(skill, `Unable to find the skill by name: ${name}`);
    }
    static getShadowSkillsBySkillName(name) {
        this.tryToThrowUninitializedError();
        const shadowSkills = [];
        for (const [skillName, skill] of Object.entries(Sanguosha.skills)) {
            if (skillName.match(new RegExp(`#+${name}`))) {
                shadowSkills.push(skill);
            }
        }
        return shadowSkills;
    }
    static isShadowSkillName(name) {
        this.tryToThrowUninitializedError();
        return name.startsWith('#');
    }
    static getCharacterByCharaterName(name) {
        this.tryToThrowUninitializedError();
        const character = Sanguosha.characters.find(character => character.Name === name);
        return precondition_1.Precondition.exists(character, `Unable to find character by name: ${name}`);
    }
    static getRandomCharacters(numberOfCharacters, charactersPool = this.characters, except, filter) {
        const characterIndex = [];
        const availableCharacters = charactersPool.filter(character => !except.includes(character.Id) && (filter ? filter(character) : true));
        if (availableCharacters.length === 0) {
            return [];
        }
        for (let i = 0; i < availableCharacters.length; i++) {
            characterIndex.push(i);
        }
        const selectedCharacterIndex = [];
        while (numberOfCharacters > 0) {
            selectedCharacterIndex.push(characterIndex.splice(Math.floor(Math.random() * characterIndex.length), 1)[0]);
            numberOfCharacters--;
        }
        return selectedCharacterIndex.map(index => availableCharacters[index]);
    }
    static getAllCharacters(except = []) {
        return this.characters.filter(character => !except.includes(character.Id));
    }
    static getLordCharacters(packages) {
        return this.characters.filter(character => character.isLord() && packages.includes(character.Package));
    }
    static isVirtualCardId(cardId) {
        return typeof cardId === 'string';
    }
    static getGameCharacterExtensions() {
        return [
            "standard" /* Standard */,
            "wind" /* Wind */,
            "fire" /* Fire */,
            "forest" /* Forest */,
            "mountain" /* Mountain */,
            "shadow" /* Shadow */,
            "thunder" /* Thunder */,
            "god" /* God */,
            "yijiang2011" /* YiJiang2011 */,
            "yijiang2012" /* YiJiang2012 */,
            "yijiang2013" /* YiJiang2013 */,
            "yijiang2014" /* YiJiang2014 */,
            "yijiang2015" /* YiJiang2015 */,
            "yuan6" /* Yuan6 */,
            "yuan7" /* Yuan7 */,
            "sp" /* SP */,
            "spark" /* Spark */,
            "decade" /* Decade */,
            "limited" /* Limited */,
            "biographies" /* Biographies */,
            "mobile" /* Mobile */,
            "wisdom" /* Wisdom */,
            "sincerity" /* Sincerity */,
            "benevolence" /* Benevolence */,
            "strategem" /* Strategem */,
            "sincerity" /* Sincerity */,
        ];
    }
    static getNationalitiesList() {
        return [
            0 /* Wei */,
            1 /* Shu */,
            2 /* Wu */,
            3 /* Qun */,
            4 /* God */,
        ];
    }
    static getCardExtensionsFromGameMode(mode) {
        switch (mode) {
            //@@TODO: add hegemony card extensions here
            case "hegemony-game" /* Hegemony */:
            case "1v2" /* OneVersusTwo */:
            case "pve" /* Pve */:
            case "pve-classic" /* PveClassic */:
            case "standard-game" /* Standard */:
            case "2v2" /* TwoVersusTwo */:
                return ["standard" /* Standard */, "legion_fight" /* LegionFight */];
            default:
                throw precondition_1.Precondition.UnreachableError(mode);
        }
    }
    static get Version() {
        return Sanguosha.version;
    }
    static get PlainVersion() {
        return version_1.coreVersion;
    }
}
exports.Sanguosha = Sanguosha;
Sanguosha.hasInitialized = false;
Sanguosha.skills = {};
Sanguosha.uniquCardMaps = new Map();
Sanguosha.characters = [];
Sanguosha.transformSkills = [];
Sanguosha.cardCategories = {};
