"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FireAttack = void 0;
const trick_card_1 = require("core/cards/trick_card");
const game_props_1 = require("core/game/game_props");
const loader_skills_1 = require("core/game/package_loader/loader.skills");
class FireAttack extends trick_card_1.TrickCard {
    constructor(id, cardNumber, suit) {
        super(id, cardNumber, suit, game_props_1.INFINITE_DISTANCE, 'fire_attack', 'fire_attack_description', "legion_fight" /* LegionFight */, loader_skills_1.SkillLoader.getInstance().getSkillByName('fire_attack'));
    }
    get Skill() {
        return this.skill;
    }
}
exports.FireAttack = FireAttack;
