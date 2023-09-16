"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WenYang = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLorderInstance = loader_skills_1.SkillLoader.getInstance();
class WenYang extends character_1.Character {
    constructor(id) {
        super(id, 'wenyang', 0 /* Male */, 0 /* Wei */, 5, 5, "limited" /* Limited */, [
            skillLorderInstance.getSkillByName('lvli'),
            skillLorderInstance.getSkillByName('choujue'),
        ]);
    }
}
exports.WenYang = WenYang;
