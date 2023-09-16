"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SPCaoRen = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLorderInstance = loader_skills_1.SkillLoader.getInstance();
class SPCaoRen extends character_1.Character {
    constructor(id) {
        super(id, 'sp_caoren', 0 /* Male */, 0 /* Wei */, 4, 4, "sp" /* SP */, [
            ...skillLorderInstance.getSkillsByName('weikui'),
            skillLorderInstance.getSkillByName('lizhan'),
        ]);
    }
}
exports.SPCaoRen = SPCaoRen;
