"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GodXunYu = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class GodXunYu extends character_1.Character {
    constructor(id) {
        super(id, 'god_xunyu', 0 /* Male */, 4 /* God */, 3, 3, "god" /* God */, [
            ...skillLoaderInstance.getSkillsByName('tianzuo'),
            skillLoaderInstance.getSkillByName('lingce'),
            skillLoaderInstance.getSkillByName('dinghan'),
        ]);
    }
}
exports.GodXunYu = GodXunYu;
