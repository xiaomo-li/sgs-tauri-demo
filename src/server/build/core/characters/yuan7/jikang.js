"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JiKang = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class JiKang extends character_1.Character {
    constructor(id) {
        super(id, 'jikang', 0 /* Male */, 0 /* Wei */, 3, 3, "yuan7" /* Yuan7 */, [
            skillLoaderInstance.getSkillByName('qingxian'),
            skillLoaderInstance.getSkillByName('juexiang'),
        ]);
    }
}
exports.JiKang = JiKang;
