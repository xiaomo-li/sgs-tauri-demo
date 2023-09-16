"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZhouYu = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class ZhouYu extends character_1.Character {
    constructor(id) {
        super(id, 'zhouyu', 0 /* Male */, 2 /* Wu */, 3, 3, "standard" /* Standard */, [
            ...skillLoaderInstance.getSkillsByName('yingzi'),
            skillLoaderInstance.getSkillByName('fanjian'),
        ]);
    }
}
exports.ZhouYu = ZhouYu;
