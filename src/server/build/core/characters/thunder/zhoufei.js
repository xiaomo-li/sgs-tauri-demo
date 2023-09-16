"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZhouFei = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class ZhouFei extends character_1.Character {
    constructor(id) {
        super(id, 'zhoufei', 1 /* Female */, 2 /* Wu */, 3, 3, "thunder" /* Thunder */, [
            ...skillLoaderInstance.getSkillsByName('liangyin'),
            ...skillLoaderInstance.getSkillsByName('kongsheng'),
        ]);
    }
}
exports.ZhouFei = ZhouFei;
