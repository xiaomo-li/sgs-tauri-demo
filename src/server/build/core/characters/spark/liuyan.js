"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiuYan = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLorderInstance = loader_skills_1.SkillLoader.getInstance();
class LiuYan extends character_1.Character {
    constructor(id) {
        super(id, 'liuyan', 0 /* Male */, 3 /* Qun */, 3, 3, "spark" /* Spark */, [
            skillLorderInstance.getSkillByName('tushe'),
            ...skillLorderInstance.getSkillsByName('limu'),
        ]);
    }
}
exports.LiuYan = LiuYan;
