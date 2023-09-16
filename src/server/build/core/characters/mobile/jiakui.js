"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JiaKui = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class JiaKui extends character_1.Character {
    constructor(id) {
        super(id, 'jiakui', 0 /* Male */, 0 /* Wei */, 3, 3, "mobile" /* Mobile */, [
            skillLoaderInstance.getSkillByName('zhongzuo'),
            ...skillLoaderInstance.getSkillsByName('wanlan'),
        ]);
    }
}
exports.JiaKui = JiaKui;
