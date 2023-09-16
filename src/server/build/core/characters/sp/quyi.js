"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuYi = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLorderInstance = loader_skills_1.SkillLoader.getInstance();
class QuYi extends character_1.Character {
    constructor(id) {
        super(id, 'quyi', 0 /* Male */, 3 /* Qun */, 4, 4, "sp" /* SP */, [
            skillLorderInstance.getSkillByName('fuji'),
            skillLorderInstance.getSkillByName('jiaozi'),
        ]);
    }
}
exports.QuYi = QuYi;
