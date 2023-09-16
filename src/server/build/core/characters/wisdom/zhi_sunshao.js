"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZhiSunShao = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLorderInstance = loader_skills_1.SkillLoader.getInstance();
class ZhiSunShao extends character_1.Character {
    constructor(id) {
        super(id, 'zhi_sunshao', 0 /* Male */, 2 /* Wu */, 3, 3, "sp" /* SP */, [
            ...skillLorderInstance.getSkillsByName('fubi'),
            ...skillLorderInstance.getSkillsByName('zuici'),
        ]);
    }
}
exports.ZhiSunShao = ZhiSunShao;
