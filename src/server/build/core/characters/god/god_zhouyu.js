"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GodZhouYu = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class GodZhouYu extends character_1.Character {
    constructor(id) {
        super(id, 'god_zhouyu', 0 /* Male */, 4 /* God */, 4, 4, "god" /* God */, [
            skillLoaderInstance.getSkillByName('qinyin'),
            skillLoaderInstance.getSkillByName('yeyan'),
        ]);
    }
}
exports.GodZhouYu = GodZhouYu;
