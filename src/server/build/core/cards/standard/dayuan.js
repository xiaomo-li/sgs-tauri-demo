"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DaYuan = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const equip_card_1 = require("../equip_card");
class DaYuan extends equip_card_1.OffenseRideCard {
    constructor(id, cardNumber, suit) {
        super(id, cardNumber, suit, 'dayuan', 'dayuan_description', "standard" /* Standard */, loader_skills_1.SkillLoader.getInstance().getSkillByName('offense_horse'));
    }
}
exports.DaYuan = DaYuan;
