"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LuZhi = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class LuZhi extends character_1.Character {
    constructor(id) {
        super(id, 'luzhi', 0 /* Male */, 3 /* Qun */, 3, 3, "shadow" /* Shadow */, [
            ...skillLoaderInstance.getSkillsByName('mingren'),
            ...skillLoaderInstance.getSkillsByName('zhenliang'),
        ]);
    }
}
exports.LuZhi = LuZhi;
