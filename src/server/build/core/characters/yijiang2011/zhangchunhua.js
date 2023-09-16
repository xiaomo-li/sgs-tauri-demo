"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZhangChunHua = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class ZhangChunHua extends character_1.Character {
    constructor(id) {
        super(id, 'zhangchunhua', 1 /* Female */, 0 /* Wei */, 3, 3, "yijiang2011" /* YiJiang2011 */, [skillLoaderInstance.getSkillByName('jueqing'), skillLoaderInstance.getSkillByName('shangshi')]);
    }
}
exports.ZhangChunHua = ZhangChunHua;
