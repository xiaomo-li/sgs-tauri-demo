"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WangShuang = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLorderInstance = loader_skills_1.SkillLoader.getInstance();
class WangShuang extends character_1.Character {
    constructor(id) {
        super(id, 'wangshuang', 0 /* Male */, 0 /* Wei */, 8, 8, "limited" /* Limited */, [
            ...skillLorderInstance.getSkillsByName('zhuilie'),
        ]);
    }
}
exports.WangShuang = WangShuang;
