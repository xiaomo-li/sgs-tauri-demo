"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuanShiFu = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const equip_card_1 = require("../equip_card");
class GuanShiFu extends equip_card_1.WeaponCard {
    constructor(id, cardNumber, suit) {
        super(id, cardNumber, suit, 'guanshifu', 'guanshifu_description', "standard" /* Standard */, loader_skills_1.SkillLoader.getInstance().getSkillByName('guanshifu'), 3);
    }
    get Skill() {
        return this.skill;
    }
}
exports.GuanShiFu = GuanShiFu;
