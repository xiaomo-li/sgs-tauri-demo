"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiLu = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const equip_card_1 = require("../equip_card");
class DiLu extends equip_card_1.DefenseRideCard {
    constructor(id, cardNumber, suit) {
        super(id, cardNumber, suit, 'dilu', 'dilu_description', "standard" /* Standard */, loader_skills_1.SkillLoader.getInstance().getSkillByName('defense_horse'));
    }
}
exports.DiLu = DiLu;
