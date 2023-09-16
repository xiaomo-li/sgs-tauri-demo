"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PanJun = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLorderInstance = loader_skills_1.SkillLoader.getInstance();
class PanJun extends character_1.Character {
    constructor(id) {
        super(id, 'panjun', 0 /* Male */, 2 /* Wu */, 3, 3, "spark" /* Spark */, [
            skillLorderInstance.getSkillByName('guanwei'),
            skillLorderInstance.getSkillByName('gongqing'),
        ]);
    }
}
exports.PanJun = PanJun;
