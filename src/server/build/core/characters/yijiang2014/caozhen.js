"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaoZhen = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class CaoZhen extends character_1.Character {
    constructor(id) {
        super(id, 'caozhen', 0 /* Male */, 0 /* Wei */, 4, 4, "yijiang2014" /* YiJiang2014 */, [
            ...skillLoaderInstance.getSkillsByName('sidi'),
        ]);
    }
}
exports.CaoZhen = CaoZhen;
