"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GongSunYuan = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class GongSunYuan extends character_1.Character {
    constructor(id) {
        super(id, 'gongsunyuan', 0 /* Male */, 3 /* Qun */, 4, 4, "yijiang2015" /* YiJiang2015 */, [...skillLoaderInstance.getSkillsByName('huaiyi')]);
    }
}
exports.GongSunYuan = GongSunYuan;
