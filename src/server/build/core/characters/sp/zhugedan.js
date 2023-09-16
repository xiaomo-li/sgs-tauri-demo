"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZhuGeDan = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLorderInstance = loader_skills_1.SkillLoader.getInstance();
class ZhuGeDan extends character_1.Character {
    constructor(id) {
        super(id, 'zhugedan', 0 /* Male */, 0 /* Wei */, 4, 4, "sp" /* SP */, [
            skillLorderInstance.getSkillByName('gongao'),
            skillLorderInstance.getSkillByName('juyi'),
        ]);
    }
}
exports.ZhuGeDan = ZhuGeDan;
