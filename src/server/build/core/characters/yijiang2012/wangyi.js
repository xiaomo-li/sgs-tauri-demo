"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WangYi = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class WangYi extends character_1.Character {
    constructor(id) {
        super(id, 'wangyi', 1 /* Female */, 0 /* Wei */, 4, 4, "yijiang2012" /* YiJiang2012 */, [
            skillLoaderInstance.getSkillByName('zhenlie'),
            ...skillLoaderInstance.getSkillsByName('miji'),
        ]);
    }
}
exports.WangYi = WangYi;
