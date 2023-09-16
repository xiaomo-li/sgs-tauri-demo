"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZhangSong = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class ZhangSong extends character_1.Character {
    constructor(id) {
        super(id, 'zhangsong', 0 /* Male */, 1 /* Shu */, 3, 3, "yijiang2014" /* YiJiang2014 */, [
            ...skillLoaderInstance.getSkillsByName('qiangzhi'),
            ...skillLoaderInstance.getSkillsByName('xiantu'),
        ]);
    }
}
exports.ZhangSong = ZhangSong;
