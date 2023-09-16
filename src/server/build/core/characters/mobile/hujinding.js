"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HuJinDing = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class HuJinDing extends character_1.Character {
    constructor(id) {
        super(id, 'hujinding', 1 /* Female */, 1 /* Shu */, 6, 2, "mobile" /* Mobile */, [
            skillLoaderInstance.getSkillByName('renshi'),
            skillLoaderInstance.getSkillByName('wuyuan'),
            skillLoaderInstance.getSkillByName('huaizi'),
        ]);
    }
}
exports.HuJinDing = HuJinDing;
