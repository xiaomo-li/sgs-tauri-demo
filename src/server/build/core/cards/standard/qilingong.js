"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QiLinGong = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const equip_card_1 = require("../equip_card");
class QiLinGong extends equip_card_1.WeaponCard {
    constructor(id, cardNumber, suit) {
        super(id, cardNumber, suit, 'qilingong', 'qilingong_description', "standard" /* Standard */, loader_skills_1.SkillLoader.getInstance().getSkillByName('qilingong'), 5);
    }
}
exports.QiLinGong = QiLinGong;
