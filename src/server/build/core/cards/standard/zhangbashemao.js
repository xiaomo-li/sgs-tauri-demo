"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZhangBaSheMao = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const equip_card_1 = require("../equip_card");
class ZhangBaSheMao extends equip_card_1.WeaponCard {
    constructor(id, cardNumber, suit) {
        super(id, cardNumber, suit, 'zhangbashemao', 'zhangbashemao_description', "standard" /* Standard */, loader_skills_1.SkillLoader.getInstance().getSkillByName('zhangbashemao'), 3);
    }
    get Skill() {
        return this.skill;
    }
}
exports.ZhangBaSheMao = ZhangBaSheMao;
