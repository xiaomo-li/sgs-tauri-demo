"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WuYi = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class WuYi extends character_1.Character {
    constructor(id) {
        super(id, 'wuyi', 0 /* Male */, 1 /* Shu */, 4, 4, "yijiang2014" /* YiJiang2014 */, [
            ...skillLoaderInstance.getSkillsByName('benxi'),
        ]);
    }
}
exports.WuYi = WuYi;
