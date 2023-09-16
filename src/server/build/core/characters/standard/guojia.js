"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuoJia = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class GuoJia extends character_1.Character {
    constructor(id) {
        super(id, 'guojia', 0 /* Male */, 0 /* Wei */, 3, 3, "standard" /* Standard */, [
            skillLoaderInstance.getSkillByName('tiandu'),
            ...skillLoaderInstance.getSkillsByName('yiji'),
        ]);
    }
}
exports.GuoJia = GuoJia;
