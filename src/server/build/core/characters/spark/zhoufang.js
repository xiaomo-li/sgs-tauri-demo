"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZhouFang = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLorderInstance = loader_skills_1.SkillLoader.getInstance();
class ZhouFang extends character_1.Character {
    constructor(id) {
        super(id, 'zhoufang', 0 /* Male */, 2 /* Wu */, 3, 3, "spark" /* Spark */, [
            ...skillLorderInstance.getSkillsByName('duanfa'),
            skillLorderInstance.getSkillByName('youdi'),
        ]);
    }
}
exports.ZhouFang = ZhouFang;
