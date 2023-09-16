"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TengJia = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const equip_card_1 = require("../equip_card");
class TengJia extends equip_card_1.ArmorCard {
    constructor(id, cardNumber, suit) {
        super(id, cardNumber, suit, 'tengjia', 'tengjia_description', "legion_fight" /* LegionFight */, loader_skills_1.SkillLoader.getInstance().getSkillByName('tengjia'));
    }
    get Skill() {
        return this.skill;
    }
}
exports.TengJia = TengJia;
