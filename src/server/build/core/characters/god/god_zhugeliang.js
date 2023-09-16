"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GodZhuGeLiang = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class GodZhuGeLiang extends character_1.Character {
    constructor(id) {
        super(id, 'god_zhugeliang', 0 /* Male */, 4 /* God */, 3, 3, "god" /* God */, [
            ...skillLoaderInstance.getSkillsByName('qixing'),
            ...skillLoaderInstance.getSkillsByName('kuangfeng'),
            ...skillLoaderInstance.getSkillsByName('dawu'),
        ]);
    }
}
exports.GodZhuGeLiang = GodZhuGeLiang;
