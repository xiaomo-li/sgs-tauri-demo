"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShunshouQianYang = void 0;
const trick_card_1 = require("core/cards/trick_card");
const loader_skills_1 = require("core/game/package_loader/loader.skills");
class ShunshouQianYang extends trick_card_1.TrickCard {
    constructor(id, cardNumber, suit) {
        super(id, cardNumber, suit, 1, 'shunshouqianyang', 'shunshouqianyang_description', "standard" /* Standard */, loader_skills_1.SkillLoader.getInstance().getSkillByName('shunshouqianyang'));
    }
    get Skill() {
        return this.skill;
    }
}
exports.ShunshouQianYang = ShunshouQianYang;
