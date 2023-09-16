"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LingTong = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class LingTong extends character_1.Character {
    constructor(id) {
        super(id, 'lingtong', 0 /* Male */, 2 /* Wu */, 4, 4, "yijiang2011" /* YiJiang2011 */, [
            skillLoaderInstance.getSkillByName('xuanfeng'),
            skillLoaderInstance.getSkillByName('yongjin'),
        ]);
    }
}
exports.LingTong = LingTong;
