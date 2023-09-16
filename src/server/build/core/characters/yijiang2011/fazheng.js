"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FaZheng = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const skills_1 = require("core/skills");
const enyuan_1 = require("core/skills/characters/yijiang2011/enyuan");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class FaZheng extends character_1.Character {
    constructor(id) {
        super(id, 'fazheng', 0 /* Male */, 1 /* Shu */, 3, 3, "yijiang2011" /* YiJiang2011 */, [
            skillLoaderInstance.getSkillByName(enyuan_1.EnYuan.GeneralName),
            skillLoaderInstance.getSkillByName(skills_1.XuanHuo.GeneralName),
        ]);
    }
}
exports.FaZheng = FaZheng;
