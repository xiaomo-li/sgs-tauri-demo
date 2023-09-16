"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GodCaoCao = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class GodCaoCao extends character_1.Character {
    constructor(id) {
        super(id, 'god_caocao', 0 /* Male */, 4 /* God */, 3, 3, "god" /* God */, [
            skillLoaderInstance.getSkillByName('guixin'),
            skillLoaderInstance.getSkillByName('feiying'),
        ]);
    }
}
exports.GodCaoCao = GodCaoCao;
