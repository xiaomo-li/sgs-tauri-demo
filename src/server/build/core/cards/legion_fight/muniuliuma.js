"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MuNiuLiuMa = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const equip_card_1 = require("../equip_card");
class MuNiuLiuMa extends equip_card_1.PreciousCard {
    constructor(id, cardNumber, suit) {
        super(id, cardNumber, suit, 'muniuliuma', 'muniuliuma_description', "legion_fight" /* LegionFight */, loader_skills_1.SkillLoader.getInstance().getSkillByName('muniuliuma'));
    }
    get Skill() {
        return this.skill;
    }
}
exports.MuNiuLiuMa = MuNiuLiuMa;
