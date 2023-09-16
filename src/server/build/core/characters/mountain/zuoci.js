"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZuoCi = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const skills_1 = require("core/skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class ZuoCi extends character_1.Character {
    constructor(id) {
        super(id, 'zuoci', 0 /* Male */, 3 /* Qun */, 3, 3, "mountain" /* Mountain */, [
            skillLoaderInstance.getSkillByName(skills_1.HuaShen.GeneralName),
            skillLoaderInstance.getSkillByName(skills_1.XinSheng.GeneralName),
        ]);
    }
}
exports.ZuoCi = ZuoCi;
