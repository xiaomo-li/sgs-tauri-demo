"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QingLongYanYueDao = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const equip_card_1 = require("../equip_card");
class QingLongYanYueDao extends equip_card_1.WeaponCard {
    constructor(id, cardNumber, suit) {
        super(id, cardNumber, suit, 'qinglongyanyuedao', 'qinglongyanyuedao_description', "standard" /* Standard */, loader_skills_1.SkillLoader.getInstance().getSkillByName('qinglongyanyuedao'), 3);
    }
}
exports.QingLongYanYueDao = QingLongYanYueDao;
