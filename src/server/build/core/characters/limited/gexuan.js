"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeXuan = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLorderInstance = loader_skills_1.SkillLoader.getInstance();
class GeXuan extends character_1.Character {
    constructor(id) {
        super(id, 'gexuan', 0 /* Male */, 2 /* Wu */, 3, 3, "limited" /* Limited */, [
            ...skillLorderInstance.getSkillsByName('lianhua'),
            skillLorderInstance.getSkillByName('zhafu'),
        ]);
    }
}
exports.GeXuan = GeXuan;
