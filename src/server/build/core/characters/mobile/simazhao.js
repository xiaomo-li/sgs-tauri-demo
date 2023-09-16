"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SiMaZhao = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class SiMaZhao extends character_1.Character {
    constructor(id) {
        super(id, 'simazhao', 0 /* Male */, 0 /* Wei */, 3, 3, "mobile" /* Mobile */, [
            skillLoaderInstance.getSkillByName('daigong'),
            ...skillLoaderInstance.getSkillsByName('zhaoxin'),
        ]);
    }
}
exports.SiMaZhao = SiMaZhao;
