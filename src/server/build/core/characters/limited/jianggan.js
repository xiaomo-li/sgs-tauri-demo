"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JiangGan = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLorderInstance = loader_skills_1.SkillLoader.getInstance();
class JiangGan extends character_1.Character {
    constructor(id) {
        super(id, 'jianggan', 0 /* Male */, 0 /* Wei */, 3, 3, "limited" /* Limited */, [
            skillLorderInstance.getSkillByName('weicheng'),
            ...skillLorderInstance.getSkillsByName('daoshu'),
        ]);
    }
}
exports.JiangGan = JiangGan;
