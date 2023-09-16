"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FangTianHuaJi = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const equip_card_1 = require("../equip_card");
class FangTianHuaJi extends equip_card_1.WeaponCard {
    constructor(id, cardNumber, suit) {
        super(id, cardNumber, suit, 'fangtianhuaji', 'fangtianhuaji_description', "standard" /* Standard */, loader_skills_1.SkillLoader.getInstance().getSkillByName('fangtianhuaji'), 4);
    }
}
exports.FangTianHuaJi = FangTianHuaJi;
