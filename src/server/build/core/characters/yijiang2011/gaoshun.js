"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GaoShun = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const skills_1 = require("core/skills");
const character_1 = require("../character");
const skillLorderInstance = loader_skills_1.SkillLoader.getInstance();
class GaoShun extends character_1.Character {
    constructor(id) {
        super(id, 'gaoshun', 0 /* Male */, 3 /* Qun */, 4, 4, "yijiang2011" /* YiJiang2011 */, [
            skillLorderInstance.getSkillByName(skills_1.JinJiu.GeneralName),
            ...skillLorderInstance.getSkillsByName(skills_1.XianZhen.GeneralName),
        ]);
    }
}
exports.GaoShun = GaoShun;
