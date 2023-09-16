"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YanJun = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLorderInstance = loader_skills_1.SkillLoader.getInstance();
class YanJun extends character_1.Character {
    constructor(id) {
        super(id, 'yanjun', 0 /* Male */, 2 /* Wu */, 3, 3, "spark" /* Spark */, [
            ...skillLorderInstance.getSkillsByName('guanchao'),
            skillLorderInstance.getSkillByName('xunxian'),
        ]);
    }
}
exports.YanJun = YanJun;
