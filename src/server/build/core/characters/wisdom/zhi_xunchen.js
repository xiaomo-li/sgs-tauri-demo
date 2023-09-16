"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZhiXunChen = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class ZhiXunChen extends character_1.Character {
    constructor(id) {
        super(id, 'zhi_xunchen', 0 /* Male */, 3 /* Qun */, 3, 3, "wisdom" /* Wisdom */, [
            skillLoaderInstance.getSkillByName('jianzhan'),
            ...skillLoaderInstance.getSkillsByName('duoji'),
        ]);
    }
}
exports.ZhiXunChen = ZhiXunChen;
