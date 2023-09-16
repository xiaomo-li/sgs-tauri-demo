"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZhaoZhong = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLorderInstance = loader_skills_1.SkillLoader.getInstance();
class ZhaoZhong extends character_1.Character {
    constructor(id) {
        super(id, 'zhaozhong', 0 /* Male */, 3 /* Qun */, 6, 6, "decade" /* Decade */, [
            skillLorderInstance.getSkillByName('yangzhong'),
            skillLorderInstance.getSkillByName('huangkong'),
        ]);
    }
}
exports.ZhaoZhong = ZhaoZhong;
