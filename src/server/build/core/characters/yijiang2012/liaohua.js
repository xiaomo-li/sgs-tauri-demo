"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiaoHua = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class LiaoHua extends character_1.Character {
    constructor(id) {
        super(id, 'liaohua', 0 /* Male */, 1 /* Shu */, 4, 4, "yijiang2012" /* YiJiang2012 */, [
            skillLoaderInstance.getSkillByName('dangxian'),
            skillLoaderInstance.getSkillByName('fuli'),
        ]);
    }
}
exports.LiaoHua = LiaoHua;
