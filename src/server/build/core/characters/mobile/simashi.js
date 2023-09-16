"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SiMaShi = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class SiMaShi extends character_1.Character {
    constructor(id) {
        super(id, 'simashi', 0 /* Male */, 0 /* Wei */, 4, 4, "mobile" /* Mobile */, [
            skillLoaderInstance.getSkillByName('baiyi'),
            skillLoaderInstance.getSkillByName('jinglve'),
            skillLoaderInstance.getSkillByName('shanli'),
        ]);
    }
}
exports.SiMaShi = SiMaShi;
