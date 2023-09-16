"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GodJiangWei = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class GodJiangWei extends character_1.Character {
    constructor(id) {
        super(id, 'god_jiangwei', 0 /* Male */, 4 /* God */, 4, 4, "god" /* God */, [
            ...skillLoaderInstance.getSkillsByName('tianren'),
            ...skillLoaderInstance.getSkillsByName('jiufa'),
            ...skillLoaderInstance.getSkillsByName('pingxiang'),
        ]);
    }
}
exports.GodJiangWei = GodJiangWei;
