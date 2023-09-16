"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YuFan = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const skills_1 = require("core/skills");
const zhiyan_1 = require("core/skills/characters/yijiang2013/zhiyan");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class YuFan extends character_1.Character {
    constructor(id) {
        super(id, 'yufan', 0 /* Male */, 2 /* Wu */, 3, 3, "yijiang2013" /* YiJiang2013 */, [
            skillLoaderInstance.getSkillByName(skills_1.ZongXuan.Name),
            skillLoaderInstance.getSkillByName(zhiyan_1.ZhiYan.Name),
        ]);
    }
}
exports.YuFan = YuFan;
