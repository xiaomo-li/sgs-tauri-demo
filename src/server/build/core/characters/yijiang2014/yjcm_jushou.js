"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YjcmJuShou = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class YjcmJuShou extends character_1.Character {
    constructor(id) {
        super(id, 'yjcm_jushou', 0 /* Male */, 3 /* Qun */, 3, 3, "yijiang2014" /* YiJiang2014 */, [...skillLoaderInstance.getSkillsByName('jianying'), ...skillLoaderInstance.getSkillsByName('shibei')]);
    }
}
exports.YjcmJuShou = YjcmJuShou;
