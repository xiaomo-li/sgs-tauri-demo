"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZhenJi = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class ZhenJi extends character_1.Character {
    constructor(id) {
        super(id, 'zhenji', 1 /* Female */, 0 /* Wei */, 3, 3, "standard" /* Standard */, [
            skillLoaderInstance.getSkillByName('qingguo'),
            ...skillLoaderInstance.getSkillsByName('luoshen'),
        ]);
    }
}
exports.ZhenJi = ZhenJi;
