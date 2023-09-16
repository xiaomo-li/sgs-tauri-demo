"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RenWangDun = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const equip_card_1 = require("../equip_card");
class RenWangDun extends equip_card_1.ArmorCard {
    constructor(id, cardNumber, suit) {
        super(id, cardNumber, suit, 'renwangdun', 'renwangdun_description', "standard" /* Standard */, loader_skills_1.SkillLoader.getInstance().getSkillByName('renwangdun'));
    }
    get Skill() {
        return this.skill;
    }
}
exports.RenWangDun = RenWangDun;
