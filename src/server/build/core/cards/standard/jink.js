"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Jink = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const basic_card_1 = require("../basic_card");
class Jink extends basic_card_1.BasicCard {
    constructor(id, cardNumber, suit) {
        super(id, cardNumber, suit, 0, 'jink', 'jink_description', "standard" /* Standard */, loader_skills_1.SkillLoader.getInstance().getSkillByName('jink'));
    }
    get Skill() {
        return this.skill;
    }
}
exports.Jink = Jink;
