"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WangRong = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class WangRong extends character_1.Character {
    constructor(id) {
        super(id, 'wangrong', 1 /* Female */, 3 /* Qun */, 3, 3, "biographies" /* Biographies */, [
            ...skillLoaderInstance.getSkillsByName('minsi'),
            skillLoaderInstance.getSkillByName('jijing'),
            skillLoaderInstance.getSkillByName('zhuide'),
        ]);
    }
}
exports.WangRong = WangRong;
