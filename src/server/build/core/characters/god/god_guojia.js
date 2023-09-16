"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GodGuoJia = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class GodGuoJia extends character_1.Character {
    constructor(id) {
        super(id, 'god_guojia', 0 /* Male */, 4 /* God */, 3, 3, "god" /* God */, [
            skillLoaderInstance.getSkillByName('god_huishi'),
            skillLoaderInstance.getSkillByName('god_tianyi'),
            skillLoaderInstance.getSkillByName('god_huishi_sec'),
        ]);
    }
}
exports.GodGuoJia = GodGuoJia;
