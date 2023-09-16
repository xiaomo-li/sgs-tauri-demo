"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaoHong = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLorderInstance = loader_skills_1.SkillLoader.getInstance();
class CaoHong extends character_1.Character {
    constructor(id) {
        super(id, 'caohong', 0 /* Male */, 0 /* Wei */, 4, 4, "sp" /* SP */, [
            skillLorderInstance.getSkillByName('yuanhu'),
        ]);
    }
}
exports.CaoHong = CaoHong;
