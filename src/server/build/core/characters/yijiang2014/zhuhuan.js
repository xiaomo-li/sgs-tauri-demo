"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZhuHuan = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class ZhuHuan extends character_1.Character {
    constructor(id) {
        super(id, 'zhuhuan', 0 /* Male */, 2 /* Wu */, 4, 4, "yijiang2014" /* YiJiang2014 */, [
            skillLoaderInstance.getSkillByName('fenli'),
            skillLoaderInstance.getSkillByName('pingkou'),
        ]);
    }
}
exports.ZhuHuan = ZhuHuan;
