"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JiaXu = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class JiaXu extends character_1.Character {
    constructor(id) {
        super(id, 'jiaxu', 0 /* Male */, 3 /* Qun */, 3, 3, "forest" /* Forest */, [
            skillLoaderInstance.getSkillByName('wansha'),
            skillLoaderInstance.getSkillByName('luanwu'),
            skillLoaderInstance.getSkillByName('weimu'),
        ]);
    }
}
exports.JiaXu = JiaXu;
