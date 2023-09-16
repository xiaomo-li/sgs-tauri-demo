"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZhuGeLianNu = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const equip_card_1 = require("../equip_card");
class ZhuGeLianNu extends equip_card_1.WeaponCard {
    constructor(id, cardNumber, suit) {
        super(id, cardNumber, suit, 'zhugeliannu', 'zhugeliannu_description', "standard" /* Standard */, loader_skills_1.SkillLoader.getInstance().getSkillByName('zhugeliannu'), 1);
    }
}
exports.ZhuGeLianNu = ZhuGeLianNu;
