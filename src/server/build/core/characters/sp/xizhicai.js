"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XiZhiCai = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLorderInstance = loader_skills_1.SkillLoader.getInstance();
class XiZhiCai extends character_1.Character {
    constructor(id) {
        super(id, 'xizhicai', 0 /* Male */, 0 /* Wei */, 3, 3, "sp" /* SP */, [
            skillLorderInstance.getSkillByName('tiandu'),
            ...skillLorderInstance.getSkillsByName('xianfu'),
            skillLorderInstance.getSkillByName('chouce'),
        ]);
    }
}
exports.XiZhiCai = XiZhiCai;
