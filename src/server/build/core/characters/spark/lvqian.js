"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LvQian = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLorderInstance = loader_skills_1.SkillLoader.getInstance();
class LvQian extends character_1.Character {
    constructor(id) {
        super(id, 'lvqian', 0 /* Male */, 0 /* Wei */, 4, 4, "spark" /* Spark */, [
            ...skillLorderInstance.getSkillsByName('weilu'),
            skillLorderInstance.getSkillByName('zengdao'),
        ]);
    }
}
exports.LvQian = LvQian;
