"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LingCao = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class LingCao extends character_1.Character {
    constructor(id) {
        super(id, 'lingcao', 0 /* Male */, 2 /* Wu */, 4, 4, "mobile" /* Mobile */, [
            skillLoaderInstance.getSkillByName('dujin'),
        ]);
    }
}
exports.LingCao = LingCao;
