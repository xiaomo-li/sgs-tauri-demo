"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThunderSlash = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const slash_1 = require("../standard/slash");
class ThunderSlash extends slash_1.Slash {
    constructor(id, cardNumber, suit) {
        super(id, cardNumber, suit);
        this.name = 'thunder_slash';
        this.description = 'thunder_slash_description';
        this.fromPackage = "legion_fight" /* LegionFight */;
        this.skill = loader_skills_1.SkillLoader.getInstance().getSkillByName('thunder_slash');
    }
    get Skill() {
        return this.skill;
    }
}
exports.ThunderSlash = ThunderSlash;
