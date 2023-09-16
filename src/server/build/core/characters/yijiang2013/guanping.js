"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuanPing = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class GuanPing extends character_1.Character {
    constructor(id) {
        super(id, 'guanping', 0 /* Male */, 1 /* Shu */, 4, 4, "yijiang2013" /* YiJiang2013 */, [
            ...skillLoaderInstance.getSkillsByName('longyin'),
            skillLoaderInstance.getSkillByName('jiezhong'),
        ]);
    }
}
exports.GuanPing = GuanPing;
