"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZhuZhi = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class ZhuZhi extends character_1.Character {
    constructor(id) {
        super(id, 'zhuzhi', 0 /* Male */, 2 /* Wu */, 4, 4, "yijiang2015" /* YiJiang2015 */, [
            skillLoaderInstance.getSkillByName('anguo'),
        ]);
    }
}
exports.ZhuZhi = ZhuZhi;
