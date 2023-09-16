"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuoTuPangJi = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class GuoTuPangJi extends character_1.Character {
    constructor(id) {
        super(id, 'guotupangji', 0 /* Male */, 3 /* Qun */, 3, 3, "yijiang2015" /* YiJiang2015 */, [...skillLoaderInstance.getSkillsByName('jigong'), skillLoaderInstance.getSkillByName('shifei')]);
    }
}
exports.GuoTuPangJi = GuoTuPangJi;
