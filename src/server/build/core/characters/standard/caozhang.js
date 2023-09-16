"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaoZhang = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class CaoZhang extends character_1.Character {
    constructor(id) {
        super(id, 'caozhang', 0 /* Male */, 0 /* Wei */, 4, 4, "standard" /* Standard */, [
            ...skillLoaderInstance.getSkillsByName('jiangchi'),
        ]);
    }
}
exports.CaoZhang = CaoZhang;
