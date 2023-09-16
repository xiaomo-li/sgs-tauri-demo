"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiYan = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class LiYan extends character_1.Character {
    constructor(id) {
        super(id, 'liyan', 0 /* Male */, 1 /* Shu */, 3, 3, "yuan6" /* Yuan6 */, [
            skillLoaderInstance.getSkillByName('duliang'),
            ...skillLoaderInstance.getSkillsByName('fulin'),
        ]);
    }
}
exports.LiYan = LiYan;
