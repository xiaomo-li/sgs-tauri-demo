"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WanNianGongZhu = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLorderInstance = loader_skills_1.SkillLoader.getInstance();
class WanNianGongZhu extends character_1.Character {
    constructor(id) {
        super(id, 'wanniangongzhu', 1 /* Female */, 3 /* Qun */, 3, 3, "decade" /* Decade */, [skillLorderInstance.getSkillByName('zhenge'), ...skillLorderInstance.getSkillsByName('xinghan')]);
    }
}
exports.WanNianGongZhu = WanNianGongZhu;
