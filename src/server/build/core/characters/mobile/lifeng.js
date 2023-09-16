"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiFeng = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class LiFeng extends character_1.Character {
    constructor(id) {
        super(id, 'lifeng', 0 /* Male */, 1 /* Shu */, 3, 3, "mobile" /* Mobile */, [
            ...skillLoaderInstance.getSkillsByName('tunchu'),
            skillLoaderInstance.getSkillByName('shuliang'),
        ]);
    }
}
exports.LiFeng = LiFeng;
