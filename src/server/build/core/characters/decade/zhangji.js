"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZhangJi = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLorderInstance = loader_skills_1.SkillLoader.getInstance();
class ZhangJi extends character_1.Character {
    constructor(id) {
        super(id, 'zhangji', 0 /* Male */, 3 /* Qun */, 4, 4, "decade" /* Decade */, [
            skillLorderInstance.getSkillByName('lveming'),
            skillLorderInstance.getSkillByName('tunjun'),
        ]);
    }
}
exports.ZhangJi = ZhangJi;
