"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WangJi = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class WangJi extends character_1.Character {
    constructor(id) {
        super(id, 'wangji', 0 /* Male */, 0 /* Wei */, 3, 3, "shadow" /* Shadow */, [
            ...skillLoaderInstance.getSkillsByName('qizhi'),
            skillLoaderInstance.getSkillByName('jinqu'),
        ]);
    }
}
exports.WangJi = WangJi;
