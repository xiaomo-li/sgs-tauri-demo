"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaoXing = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLorderInstance = loader_skills_1.SkillLoader.getInstance();
class CaoXing extends character_1.Character {
    constructor(id) {
        super(id, 'caoxing', 0 /* Male */, 3 /* Qun */, 4, 4, "decade" /* Decade */, [
            ...skillLorderInstance.getSkillsByName('liushi'),
            skillLorderInstance.getSkillByName('zhanwan'),
        ]);
    }
}
exports.CaoXing = CaoXing;
