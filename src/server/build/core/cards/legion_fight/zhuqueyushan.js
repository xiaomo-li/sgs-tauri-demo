"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZhuQueYuShan = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const equip_card_1 = require("../equip_card");
class ZhuQueYuShan extends equip_card_1.WeaponCard {
    constructor(id, cardNumber, suit) {
        super(id, cardNumber, suit, 'zhuqueyushan', 'zhuqueyushan_description', "legion_fight" /* LegionFight */, loader_skills_1.SkillLoader.getInstance().getSkillByName('zhuqueyushan'), 4);
    }
    get Skill() {
        return this.skill;
    }
}
exports.ZhuQueYuShan = ZhuQueYuShan;
