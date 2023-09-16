"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuanQiuJian = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class GuanQiuJian extends character_1.Character {
    constructor(id) {
        super(id, 'guanqiujian', 0 /* Male */, 0 /* Wei */, 4, 4, "thunder" /* Thunder */, [
            skillLoaderInstance.getSkillByName('zhengrong'),
            skillLoaderInstance.getSkillByName('hongju'),
        ]);
    }
}
exports.GuanQiuJian = GuanQiuJian;
