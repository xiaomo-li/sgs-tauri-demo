"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WuZhongShengYou = void 0;
const trick_card_1 = require("core/cards/trick_card");
const loader_skills_1 = require("core/game/package_loader/loader.skills");
class WuZhongShengYou extends trick_card_1.TrickCard {
    constructor(id, cardNumber, suit) {
        super(id, cardNumber, suit, 0, 'wuzhongshengyou', 'wuzhongshengyou_description', "standard" /* Standard */, loader_skills_1.SkillLoader.getInstance().getSkillByName('wuzhongshengyou'));
    }
    get Skill() {
        return this.skill;
    }
}
exports.WuZhongShengYou = WuZhongShengYou;
