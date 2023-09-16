"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuYong = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class GuYong extends character_1.Character {
    constructor(id) {
        super(id, 'guyong', 0 /* Male */, 2 /* Wu */, 3, 3, "yijiang2014" /* YiJiang2014 */, [
            skillLoaderInstance.getSkillByName('shenxing'),
            skillLoaderInstance.getSkillByName('bingyi'),
        ]);
    }
}
exports.GuYong = GuYong;
