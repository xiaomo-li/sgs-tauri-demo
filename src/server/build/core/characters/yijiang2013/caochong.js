"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaoChong = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const chengxiang_1 = require("core/skills/characters/yijiang2013/chengxiang");
const renxin_1 = require("core/skills/characters/yijiang2013/renxin");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class CaoChong extends character_1.Character {
    constructor(id) {
        super(id, 'caochong', 0 /* Male */, 0 /* Wei */, 3, 3, "yijiang2013" /* YiJiang2013 */, [
            skillLoaderInstance.getSkillByName(chengxiang_1.ChengXiang.Name),
            skillLoaderInstance.getSkillByName(renxin_1.RenXin.Name),
        ]);
    }
}
exports.CaoChong = CaoChong;
