"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaiYinShiZi = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const equip_card_1 = require("../equip_card");
class BaiYinShiZi extends equip_card_1.ArmorCard {
    constructor(id, cardNumber, suit) {
        super(id, cardNumber, suit, 'baiyinshizi', 'baiyinshizi_description', "legion_fight" /* LegionFight */, loader_skills_1.SkillLoader.getInstance().getSkillByName('baiyinshizi'));
    }
    get Skill() {
        return this.skill;
    }
}
exports.BaiYinShiZi = BaiYinShiZi;
