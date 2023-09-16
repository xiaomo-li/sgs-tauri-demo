"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaiFuRen = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class CaiFuRen extends character_1.Character {
    constructor(id) {
        super(id, 'caifuren', 1 /* Female */, 3 /* Qun */, 3, 3, "yijiang2014" /* YiJiang2014 */, [
            skillLoaderInstance.getSkillByName('qieting'),
            skillLoaderInstance.getSkillByName('xianzhou'),
        ]);
    }
}
exports.CaiFuRen = CaiFuRen;
