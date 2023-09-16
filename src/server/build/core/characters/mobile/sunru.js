"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SunRu = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class SunRu extends character_1.Character {
    constructor(id) {
        super(id, 'sunru', 1 /* Female */, 2 /* Wu */, 3, 3, "mobile" /* Mobile */, [
            skillLoaderInstance.getSkillByName('yingjian'),
            skillLoaderInstance.getSkillByName('shixin'),
        ]);
    }
}
exports.SunRu = SunRu;
