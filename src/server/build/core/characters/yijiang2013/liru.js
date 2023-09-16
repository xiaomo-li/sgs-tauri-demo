"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiRu = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const fencheng_1 = require("core/skills/characters/yijiang2013/fencheng");
const juece_1 = require("core/skills/characters/yijiang2013/juece");
const mieji_1 = require("core/skills/characters/yijiang2013/mieji");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class LiRu extends character_1.Character {
    constructor(id) {
        super(id, 'liru', 0 /* Male */, 3 /* Qun */, 3, 3, "yijiang2013" /* YiJiang2013 */, [
            skillLoaderInstance.getSkillByName(juece_1.JueCe.Name),
            skillLoaderInstance.getSkillByName(mieji_1.MieJi.Name),
            skillLoaderInstance.getSkillByName(fencheng_1.FenCheng.Name),
        ]);
    }
}
exports.LiRu = LiRu;
