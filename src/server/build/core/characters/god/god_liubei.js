"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GodLiuBei = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class GodLiuBei extends character_1.Character {
    constructor(id) {
        super(id, 'god_liubei', 0 /* Male */, 4 /* God */, 6, 6, "god" /* God */, [
            ...skillLoaderInstance.getSkillsByName('longnu'),
            ...skillLoaderInstance.getSkillsByName('liu_jieying'),
        ]);
    }
}
exports.GodLiuBei = GodLiuBei;
