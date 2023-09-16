"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HanDang = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class HanDang extends character_1.Character {
    constructor(id) {
        super(id, 'handang', 0 /* Male */, 2 /* Wu */, 4, 4, "yijiang2012" /* YiJiang2012 */, [
            ...skillLoaderInstance.getSkillsByName('gongqi'),
            ...skillLoaderInstance.getSkillsByName('jiefan'),
        ]);
    }
}
exports.HanDang = HanDang;
