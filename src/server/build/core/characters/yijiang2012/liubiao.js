"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiuBiao = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class LiuBiao extends character_1.Character {
    constructor(id) {
        super(id, 'liubiao', 0 /* Male */, 3 /* Qun */, 3, 3, "yijiang2012" /* YiJiang2012 */, [
            ...skillLoaderInstance.getSkillsByName('zishou'),
            ...skillLoaderInstance.getSkillsByName('zongshi'),
        ]);
    }
}
exports.LiuBiao = LiuBiao;
