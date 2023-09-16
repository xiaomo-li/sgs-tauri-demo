"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZhuaHuangFeiDian = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const equip_card_1 = require("../equip_card");
class ZhuaHuangFeiDian extends equip_card_1.DefenseRideCard {
    constructor(id, cardNumber, suit) {
        super(id, cardNumber, suit, 'zhuahuangfeidian', 'zhuahuangfeidian_description', "standard" /* Standard */, loader_skills_1.SkillLoader.getInstance().getSkillByName('defense_horse'));
    }
}
exports.ZhuaHuangFeiDian = ZhuaHuangFeiDian;
