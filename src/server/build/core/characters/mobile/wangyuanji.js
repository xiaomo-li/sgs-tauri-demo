"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WangYuanJi = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class WangYuanJi extends character_1.Character {
    constructor(id) {
        super(id, 'wangyuanji', 1 /* Female */, 0 /* Wei */, 3, 3, "mobile" /* Mobile */, [
            ...skillLoaderInstance.getSkillsByName('qianchong'),
            skillLoaderInstance.getSkillByName('shangjian'),
        ]);
    }
}
exports.WangYuanJi = WangYuanJi;
