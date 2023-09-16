"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SPLuZhi = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLorderInstance = loader_skills_1.SkillLoader.getInstance();
class SPLuZhi extends character_1.Character {
    constructor(id) {
        super(id, 'sp_luzhi', 0 /* Male */, 0 /* Wei */, 3, 3, "sp" /* SP */, [
            ...skillLorderInstance.getSkillsByName('qingzhong'),
            skillLorderInstance.getSkillByName('weijing'),
        ]);
    }
}
exports.SPLuZhi = SPLuZhi;
