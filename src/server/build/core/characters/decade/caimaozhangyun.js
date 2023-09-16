"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaiMaoZhangYun = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLorderInstance = loader_skills_1.SkillLoader.getInstance();
class CaiMaoZhangYun extends character_1.Character {
    constructor(id) {
        super(id, 'caimaozhangyun', 0 /* Male */, 0 /* Wei */, 4, 4, "decade" /* Decade */, [
            skillLorderInstance.getSkillByName('lianzhou'),
            skillLorderInstance.getSkillByName('jinglan'),
        ]);
    }
}
exports.CaiMaoZhangYun = CaiMaoZhangYun;
