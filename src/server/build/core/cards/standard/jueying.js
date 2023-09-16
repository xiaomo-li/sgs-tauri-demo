"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JueYing = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const equip_card_1 = require("../equip_card");
class JueYing extends equip_card_1.DefenseRideCard {
    constructor(id, cardNumber, suit) {
        super(id, cardNumber, suit, 'jueying', 'jueying_description', "standard" /* Standard */, loader_skills_1.SkillLoader.getInstance().getSkillByName('defense_horse'));
    }
}
exports.JueYing = JueYing;
