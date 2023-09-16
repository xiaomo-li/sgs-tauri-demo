"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MengHuo = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class MengHuo extends character_1.Character {
    constructor(id) {
        super(id, 'menghuo', 0 /* Male */, 1 /* Shu */, 4, 4, "forest" /* Forest */, [
            skillLoaderInstance.getSkillByName('huoshou'),
            skillLoaderInstance.getSkillByName('zaiqi'),
        ]);
    }
}
exports.MengHuo = MengHuo;
