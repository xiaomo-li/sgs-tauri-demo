"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GodSunCe = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class GodSunCe extends character_1.Character {
    constructor(id) {
        super(id, 'god_sunce', 0 /* Male */, 4 /* God */, 6, 1, "god" /* God */, [
            ...skillLoaderInstance.getSkillsByName('yingba'),
            skillLoaderInstance.getSkillByName('god_fuhai'),
            ...skillLoaderInstance.getSkillsByName('pinghe'),
        ]);
    }
}
exports.GodSunCe = GodSunCe;
