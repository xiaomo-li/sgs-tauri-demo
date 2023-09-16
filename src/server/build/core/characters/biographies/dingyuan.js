"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DingYuan = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class DingYuan extends character_1.Character {
    constructor(id) {
        super(id, 'dingyuan', 0 /* Male */, 3 /* Qun */, 4, 4, "biographies" /* Biographies */, [
            skillLoaderInstance.getSkillByName('cixiao'),
            skillLoaderInstance.getSkillByName('xianshuai'),
        ]);
    }
}
exports.DingYuan = DingYuan;
