"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FuQian = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class FuQian extends character_1.Character {
    constructor(id) {
        super(id, 'fuqian', 0 /* Male */, 1 /* Shu */, 4, 4, "mobile" /* Mobile */, [
            ...skillLoaderInstance.getSkillsByName('poxiang'),
            skillLoaderInstance.getSkillByName('jueyong'),
        ]);
    }
}
exports.FuQian = FuQian;
