"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XuShu = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class XuShu extends character_1.Character {
    constructor(id) {
        super(id, 'xushu', 0 /* Male */, 1 /* Shu */, 3, 3, "yijiang2011" /* YiJiang2011 */, [
            skillLoaderInstance.getSkillByName('wuyan'),
            skillLoaderInstance.getSkillByName('jujian'),
        ]);
    }
}
exports.XuShu = XuShu;
