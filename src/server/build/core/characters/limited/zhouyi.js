"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZhouYi = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLorderInstance = loader_skills_1.SkillLoader.getInstance();
class ZhouYi extends character_1.Character {
    constructor(id) {
        super(id, 'zhouyi', 1 /* Female */, 2 /* Wu */, 3, 3, "limited" /* Limited */, [
            ...skillLorderInstance.getSkillsByName('zhukou'),
            skillLorderInstance.getSkillByName('mangqing'),
        ]);
    }
}
exports.ZhouYi = ZhouYi;
