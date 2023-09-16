"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LuJi = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class LuJi extends character_1.Character {
    constructor(id) {
        super(id, 'luji', 0 /* Male */, 2 /* Wu */, 3, 3, "shadow" /* Shadow */, [
            skillLoaderInstance.getSkillByName('huaiju'),
            skillLoaderInstance.getSkillByName('weili'),
            skillLoaderInstance.getSkillByName('zhenglun'),
        ]);
    }
}
exports.LuJi = LuJi;
