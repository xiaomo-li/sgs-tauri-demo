"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SunYi = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLorderInstance = loader_skills_1.SkillLoader.getInstance();
class SunYi extends character_1.Character {
    constructor(id) {
        super(id, 'sunyi', 0 /* Male */, 2 /* Wu */, 5, 5, "limited" /* Limited */, [
            ...skillLorderInstance.getSkillsByName('sunyi_jiqiao'),
            skillLorderInstance.getSkillByName('xiongyi'),
        ]);
    }
}
exports.SunYi = SunYi;
