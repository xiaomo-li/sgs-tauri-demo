"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaoZhi = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class CaoZhi extends character_1.Character {
    constructor(id) {
        super(id, 'caozhi', 0 /* Male */, 0 /* Wei */, 3, 3, "yijiang2011" /* YiJiang2011 */, [
            skillLoaderInstance.getSkillByName('luoying'),
            ...skillLoaderInstance.getSkillsByName('jiushi'),
            skillLoaderInstance.getSkillByName('chengzhang'),
        ]);
    }
}
exports.CaoZhi = CaoZhi;
