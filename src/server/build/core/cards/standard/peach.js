"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Peach = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const basic_card_1 = require("../basic_card");
class Peach extends basic_card_1.BasicCard {
    constructor(id, cardNumber, suit) {
        super(id, cardNumber, suit, 0, 'peach', 'peach_description', "standard" /* Standard */, loader_skills_1.SkillLoader.getInstance().getSkillByName('peach'));
    }
    get Skill() {
        return this.skill;
    }
}
exports.Peach = Peach;
