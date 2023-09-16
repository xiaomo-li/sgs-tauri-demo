"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DengAi = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class DengAi extends character_1.Character {
    constructor(id) {
        super(id, 'dengai', 0 /* Male */, 0 /* Wei */, 4, 4, "mountain" /* Mountain */, [
            ...skillLoaderInstance.getSkillsByName('tuntian'),
            skillLoaderInstance.getSkillByName('zaoxian'),
        ]);
    }
}
exports.DengAi = DengAi;
