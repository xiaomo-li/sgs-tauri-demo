"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZuMao = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLorderInstance = loader_skills_1.SkillLoader.getInstance();
class ZuMao extends character_1.Character {
    constructor(id) {
        super(id, 'zumao', 0 /* Male */, 2 /* Wu */, 4, 4, "sp" /* SP */, [
            skillLorderInstance.getSkillByName('yinbing'),
            skillLorderInstance.getSkillByName('juedi'),
        ]);
    }
}
exports.ZuMao = ZuMao;
