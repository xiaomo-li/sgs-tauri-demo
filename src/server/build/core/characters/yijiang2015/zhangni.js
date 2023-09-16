"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZhangNi = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class ZhangNi extends character_1.Character {
    constructor(id) {
        super(id, 'zhangni', 0 /* Male */, 1 /* Shu */, 5, 5, "yijiang2015" /* YiJiang2015 */, [
            skillLoaderInstance.getSkillByName('wurong'),
            ...skillLoaderInstance.getSkillsByName('shizhi'),
        ]);
    }
}
exports.ZhangNi = ZhangNi;
