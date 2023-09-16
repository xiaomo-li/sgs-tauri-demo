"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZhiDuYu = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class ZhiDuYu extends character_1.Character {
    constructor(id) {
        super(id, 'zhi_duyu', 0 /* Male */, 3 /* Qun */, 4, 4, "wisdom" /* Wisdom */, [
            skillLoaderInstance.getSkillByName('wuku'),
            skillLoaderInstance.getSkillByName('zhi_sanchen'),
        ]);
    }
}
exports.ZhiDuYu = ZhiDuYu;
