"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GodZhaoYun = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class GodZhaoYun extends character_1.Character {
    constructor(id) {
        super(id, 'god_zhaoyun', 0 /* Male */, 4 /* God */, 2, 2, "god" /* God */, [
            ...skillLoaderInstance.getSkillsByName('juejing'),
            ...skillLoaderInstance.getSkillsByName('longhun'),
        ]);
    }
}
exports.GodZhaoYun = GodZhaoYun;
