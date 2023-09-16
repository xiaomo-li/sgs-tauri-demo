"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaDai = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class MaDai extends character_1.Character {
    constructor(id) {
        super(id, 'madai', 0 /* Male */, 1 /* Shu */, 4, 4, "yijiang2012" /* YiJiang2012 */, [
            skillLoaderInstance.getSkillByName('mashu'),
            ...skillLoaderInstance.getSkillsByName('qianxi'),
        ]);
    }
}
exports.MaDai = MaDai;
