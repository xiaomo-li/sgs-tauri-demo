"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LuKang = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class LuKang extends character_1.Character {
    constructor(id) {
        super(id, 'lukang', 0 /* Male */, 2 /* Wu */, 4, 4, "thunder" /* Thunder */, [
            ...skillLoaderInstance.getSkillsByName('qianjie'),
            ...skillLoaderInstance.getSkillsByName('jueyan'),
            skillLoaderInstance.getSkillByName('poshi'),
        ]);
    }
}
exports.LuKang = LuKang;
