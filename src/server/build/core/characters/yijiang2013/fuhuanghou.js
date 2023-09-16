"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FuHuangHou = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const skills_1 = require("core/skills");
const character_1 = require("../character");
const skillLoader = loader_skills_1.SkillLoader.getInstance();
class FuHuangHou extends character_1.Character {
    constructor(id) {
        super(id, 'fuhuanghou', 1 /* Female */, 3 /* Qun */, 3, 3, "yijiang2013" /* YiJiang2013 */, [...skillLoader.getSkillsByName(skills_1.ZhuiKong.Name), skillLoader.getSkillByName(skills_1.QiuYuan.Name)]);
    }
}
exports.FuHuangHou = FuHuangHou;
