"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuLianShi = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class BuLianShi extends character_1.Character {
    constructor(id) {
        super(id, 'bulianshi', 1 /* Female */, 2 /* Wu */, 3, 3, "yijiang2012" /* YiJiang2012 */, [
            skillLoaderInstance.getSkillByName('anxu'),
            skillLoaderInstance.getSkillByName('zhuiyi'),
        ]);
    }
}
exports.BuLianShi = BuLianShi;
