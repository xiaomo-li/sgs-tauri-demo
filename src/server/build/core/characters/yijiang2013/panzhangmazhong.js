"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PanZhangMaZhong = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const anjian_1 = require("core/skills/characters/yijiang2013/anjian");
const duodao_1 = require("core/skills/characters/yijiang2013/duodao");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class PanZhangMaZhong extends character_1.Character {
    constructor(id) {
        super(id, 'panzhangmazhong', 0 /* Male */, 2 /* Wu */, 4, 4, "yijiang2013" /* YiJiang2013 */, [...skillLoaderInstance.getSkillsByName(anjian_1.AnJian.Name), skillLoaderInstance.getSkillByName(duodao_1.DuoDao.Name)]);
    }
}
exports.PanZhangMaZhong = PanZhangMaZhong;
