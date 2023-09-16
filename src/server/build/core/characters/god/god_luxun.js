"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GodLuXun = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class GodLuXun extends character_1.Character {
    constructor(id) {
        super(id, 'god_luxun', 0 /* Male */, 4 /* God */, 4, 4, "god" /* God */, [
            skillLoaderInstance.getSkillByName('junlve'),
            skillLoaderInstance.getSkillByName('cuike'),
            skillLoaderInstance.getSkillByName('zhanhuo'),
        ]);
    }
}
exports.GodLuXun = GodLuXun;
