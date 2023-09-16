"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JianYong = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const skills_1 = require("core/skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class JianYong extends character_1.Character {
    constructor(id) {
        super(id, 'jianyong', 0 /* Male */, 1 /* Shu */, 3, 3, "yijiang2013" /* YiJiang2013 */, [
            ...skillLoaderInstance.getSkillsByName(skills_1.QiaoShuo.Name),
            skillLoaderInstance.getSkillByName(skills_1.J3ZongShi.Name),
        ]);
    }
}
exports.JianYong = JianYong;
