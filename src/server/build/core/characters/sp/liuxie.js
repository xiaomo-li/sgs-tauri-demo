"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiuXie = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLorderInstance = loader_skills_1.SkillLoader.getInstance();
class LiuXie extends character_1.Character {
    constructor(id) {
        super(id, 'liuxie', 0 /* Male */, 3 /* Qun */, 3, 3, "sp" /* SP */, [
            skillLorderInstance.getSkillByName('tianming'),
            skillLorderInstance.getSkillByName('mizhao'),
        ]);
    }
}
exports.LiuXie = LiuXie;
