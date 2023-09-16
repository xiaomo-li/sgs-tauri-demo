"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pangde = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class Pangde extends character_1.Character {
    constructor(id) {
        super(id, 'pangde', 0 /* Male */, 3 /* Qun */, 4, 4, "fire" /* Fire */, [
            skillLoaderInstance.getSkillByName('mashu'),
            ...skillLoaderInstance.getSkillsByName('jianchu'),
        ]);
    }
}
exports.Pangde = Pangde;
