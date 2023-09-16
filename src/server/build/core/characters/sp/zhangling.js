"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZhangLing = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLorderInstance = loader_skills_1.SkillLoader.getInstance();
class ZhangLing extends character_1.Character {
    constructor(id) {
        super(id, 'zhangling', 0 /* Male */, 3 /* Qun */, 3, 3, "sp" /* SP */, [
            ...skillLorderInstance.getSkillsByName('huji'),
            ...skillLorderInstance.getSkillsByName('shoufu'),
        ]);
    }
}
exports.ZhangLing = ZhangLing;
