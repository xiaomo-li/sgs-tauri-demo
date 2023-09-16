"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaoSong = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class CaoSong extends character_1.Character {
    constructor(id) {
        super(id, 'caosong', 0 /* Male */, 0 /* Wei */, 4, 4, "biographies" /* Biographies */, [
            skillLoaderInstance.getSkillByName('lilu'),
            ...skillLoaderInstance.getSkillsByName('yizheng'),
        ]);
    }
}
exports.CaoSong = CaoSong;
