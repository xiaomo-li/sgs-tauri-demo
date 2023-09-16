"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuoZhao = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLorderInstance = loader_skills_1.SkillLoader.getInstance();
class GuoZhao extends character_1.Character {
    constructor(id) {
        super(id, 'guozhao', 1 /* Female */, 0 /* Wei */, 3, 3, "limited" /* Limited */, [
            ...skillLorderInstance.getSkillsByName('pianchong'),
            skillLorderInstance.getSkillByName('zunwei'),
        ]);
    }
}
exports.GuoZhao = GuoZhao;
