"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiJue = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLorderInstance = loader_skills_1.SkillLoader.getInstance();
class LiJue extends character_1.Character {
    constructor(id) {
        super(id, 'lijue', 0 /* Male */, 3 /* Qun */, 6, 4, "decade" /* Decade */, [
            skillLorderInstance.getSkillByName('langxi'),
            skillLorderInstance.getSkillByName('yisuan'),
        ]);
    }
}
exports.LiJue = LiJue;
