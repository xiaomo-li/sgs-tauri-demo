"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChenQun = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class ChenQun extends character_1.Character {
    constructor(id) {
        super(id, 'chenqun', 0 /* Male */, 0 /* Wei */, 3, 3, "yijiang2014" /* YiJiang2014 */, [
            ...skillLoaderInstance.getSkillsByName('pindi'),
            skillLoaderInstance.getSkillByName('faen'),
        ]);
    }
}
exports.ChenQun = ChenQun;
