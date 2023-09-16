"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XuJing = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLorderInstance = loader_skills_1.SkillLoader.getInstance();
class XuJing extends character_1.Character {
    constructor(id) {
        super(id, 'xujing', 0 /* Male */, 1 /* Shu */, 3, 3, "sp" /* SP */, [
            skillLorderInstance.getSkillByName('yuxu'),
            ...skillLorderInstance.getSkillsByName('shijian'),
        ]);
    }
}
exports.XuJing = XuJing;
