"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZhangHu = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLorderInstance = loader_skills_1.SkillLoader.getInstance();
class ZhangHu extends character_1.Character {
    constructor(id) {
        super(id, 'zhanghu', 0 /* Male */, 0 /* Wei */, 4, 4, "decade" /* Decade */, [
            skillLorderInstance.getSkillByName('cuijian'),
            skillLorderInstance.getSkillByName('tongyuan'),
        ]);
    }
}
exports.ZhangHu = ZhangHu;
