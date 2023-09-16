"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiDian = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class LiDian extends character_1.Character {
    constructor(id) {
        super(id, 'lidian', 0 /* Male */, 0 /* Wei */, 3, 3, "standard" /* Standard */, [
            skillLoaderInstance.getSkillByName('xunxun'),
            skillLoaderInstance.getSkillByName('wangxi'),
        ]);
    }
}
exports.LiDian = LiDian;
