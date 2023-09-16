"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SPMaChao = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLorderInstance = loader_skills_1.SkillLoader.getInstance();
class SPMaChao extends character_1.Character {
    constructor(id) {
        super(id, 'sp_machao', 0 /* Male */, 3 /* Qun */, 4, 4, "sp" /* SP */, [
            skillLorderInstance.getSkillByName('zhuiji'),
            skillLorderInstance.getSkillByName('shichou'),
        ]);
    }
}
exports.SPMaChao = SPMaChao;
