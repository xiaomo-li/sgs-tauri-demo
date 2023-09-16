"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YuJin = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const jieyue_1 = require("core/skills/characters/yijiang2011/jieyue");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class YuJin extends character_1.Character {
    constructor(id) {
        super(id, 'yujin', 0 /* Male */, 0 /* Wei */, 4, 4, "yijiang2011" /* YiJiang2011 */, [
            skillLoaderInstance.getSkillByName(jieyue_1.JieYue.GeneralName),
        ]);
    }
}
exports.YuJin = YuJin;
