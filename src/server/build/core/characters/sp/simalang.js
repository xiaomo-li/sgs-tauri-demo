"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SiMaLang = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLorderInstance = loader_skills_1.SkillLoader.getInstance();
class SiMaLang extends character_1.Character {
    constructor(id) {
        super(id, 'simalang', 0 /* Male */, 0 /* Wei */, 3, 3, "sp" /* SP */, [
            skillLorderInstance.getSkillByName('junbing'),
            skillLorderInstance.getSkillByName('quji'),
        ]);
    }
}
exports.SiMaLang = SiMaLang;
