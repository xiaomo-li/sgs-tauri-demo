"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaZhong = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLorderInstance = loader_skills_1.SkillLoader.getInstance();
class MaZhong extends character_1.Character {
    constructor(id) {
        super(id, 'mazhong', 0 /* Male */, 1 /* Shu */, 4, 4, "sp" /* SP */, [
            ...skillLorderInstance.getSkillsByName('fuman'),
        ]);
    }
}
exports.MaZhong = MaZhong;
