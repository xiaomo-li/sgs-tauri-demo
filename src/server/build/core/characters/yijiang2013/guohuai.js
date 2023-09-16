"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuoHuai = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const jingce_1 = require("core/skills/characters/yijiang2013/jingce");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class GuoHuai extends character_1.Character {
    constructor(id) {
        super(id, 'guohuai', 0 /* Male */, 0 /* Wei */, 4, 4, "yijiang2013" /* YiJiang2013 */, [
            ...skillLoaderInstance.getSkillsByName(jingce_1.JingCe.Name),
        ]);
    }
}
exports.GuoHuai = GuoHuai;
