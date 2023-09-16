"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuanYinPing = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLorderInstance = loader_skills_1.SkillLoader.getInstance();
class GuanYinPing extends character_1.Character {
    constructor(id) {
        super(id, 'guanyinping', 1 /* Female */, 1 /* Shu */, 3, 3, "sp" /* SP */, [
            skillLorderInstance.getSkillByName('xuehen'),
            ...skillLorderInstance.getSkillsByName('huxiao'),
            skillLorderInstance.getSkillByName('wuji'),
        ]);
    }
}
exports.GuanYinPing = GuanYinPing;
