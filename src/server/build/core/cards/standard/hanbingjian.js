"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HanBingJian = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const equip_card_1 = require("../equip_card");
class HanBingJian extends equip_card_1.WeaponCard {
    constructor(id, cardNumber, suit) {
        super(id, cardNumber, suit, 'hanbingjian', 'hanbingjian_description', "standard" /* Standard */, loader_skills_1.SkillLoader.getInstance().getSkillByName('hanbingjian'), 2);
    }
    get Skill() {
        return this.skill;
    }
}
exports.HanBingJian = HanBingJian;
