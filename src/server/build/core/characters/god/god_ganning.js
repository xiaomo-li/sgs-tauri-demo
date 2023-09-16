"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GodGanNing = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class GodGanNing extends character_1.Character {
    constructor(id) {
        super(id, 'god_ganning', 0 /* Male */, 4 /* God */, 6, 3, "god" /* God */, [
            skillLoaderInstance.getSkillByName('poxi'),
            ...skillLoaderInstance.getSkillsByName('jieying'),
        ]);
    }
}
exports.GodGanNing = GodGanNing;
