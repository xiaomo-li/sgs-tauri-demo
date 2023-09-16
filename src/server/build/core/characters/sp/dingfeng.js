"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DingFeng = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLorderInstance = loader_skills_1.SkillLoader.getInstance();
class DingFeng extends character_1.Character {
    constructor(id) {
        super(id, 'dingfeng', 0 /* Male */, 2 /* Wu */, 4, 4, "sp" /* SP */, [
            ...skillLorderInstance.getSkillsByName('duanbing'),
            ...skillLorderInstance.getSkillsByName('fenxun'),
        ]);
    }
}
exports.DingFeng = DingFeng;
