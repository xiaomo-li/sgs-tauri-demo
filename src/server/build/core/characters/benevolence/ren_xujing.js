"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RenXuJing = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class RenXuJing extends character_1.Character {
    constructor(id) {
        super(id, 'ren_xujing', 0 /* Male */, 1 /* Shu */, 3, 3, "benevolence" /* Benevolence */, [
            ...skillLoaderInstance.getSkillsByName('boming'),
            skillLoaderInstance.getSkillByName('ejian'),
        ]);
    }
}
exports.RenXuJing = RenXuJing;
