"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChenGong = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class ChenGong extends character_1.Character {
    constructor(id) {
        super(id, 'chengong', 0 /* Male */, 3 /* Qun */, 3, 3, "yijiang2011" /* YiJiang2011 */, [
            skillLoaderInstance.getSkillByName('mingce'),
            ...skillLoaderInstance.getSkillsByName('zhichi'),
        ]);
    }
}
exports.ChenGong = ChenGong;
