"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaoShuang = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLorderInstance = loader_skills_1.SkillLoader.getInstance();
class CaoShuang extends character_1.Character {
    constructor(id) {
        super(id, 'caoshuang', 0 /* Male */, 0 /* Wei */, 4, 4, "limited" /* Limited */, [
            skillLorderInstance.getSkillByName('tuogu'),
            skillLorderInstance.getSkillByName('shanzhuan'),
        ]);
    }
}
exports.CaoShuang = CaoShuang;
