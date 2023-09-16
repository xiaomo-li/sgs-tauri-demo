"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XiaHouShi = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class XiaHouShi extends character_1.Character {
    constructor(id) {
        super(id, 'xiahoushi', 1 /* Female */, 1 /* Shu */, 3, 3, "yijiang2015" /* YiJiang2015 */, [skillLoaderInstance.getSkillByName('qiaoshi'), ...skillLoaderInstance.getSkillsByName('yanyu')]);
    }
}
exports.XiaHouShi = XiaHouShi;
