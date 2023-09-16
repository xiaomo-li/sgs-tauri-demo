"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Duel = void 0;
const trick_card_1 = require("core/cards/trick_card");
const game_props_1 = require("core/game/game_props");
const loader_skills_1 = require("core/game/package_loader/loader.skills");
class Duel extends trick_card_1.TrickCard {
    constructor(id, cardNumber, suit) {
        super(id, cardNumber, suit, game_props_1.INFINITE_DISTANCE, 'duel', 'duel_description', "standard" /* Standard */, loader_skills_1.SkillLoader.getInstance().getSkillByName('duel'));
    }
    get Skill() {
        return this.skill;
    }
}
exports.Duel = Duel;
