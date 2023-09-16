"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CiXiongJian = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const equip_card_1 = require("../equip_card");
class CiXiongJian extends equip_card_1.WeaponCard {
    constructor(id, cardNumber, suit) {
        super(id, cardNumber, suit, 'cixiongjian', 'cixiongjian_description', "standard" /* Standard */, loader_skills_1.SkillLoader.getInstance().getSkillByName('cixiongjian'), 2);
    }
}
exports.CiXiongJian = CiXiongJian;
