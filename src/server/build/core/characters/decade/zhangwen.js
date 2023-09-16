"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZhangWen = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLorderInstance = loader_skills_1.SkillLoader.getInstance();
class ZhangWen extends character_1.Character {
    constructor(id) {
        super(id, 'zhangwen', 0 /* Male */, 2 /* Wu */, 3, 3, "decade" /* Decade */, [
            skillLorderInstance.getSkillByName('songshu'),
            skillLorderInstance.getSkillByName('sibian'),
        ]);
    }
}
exports.ZhangWen = ZhangWen;
