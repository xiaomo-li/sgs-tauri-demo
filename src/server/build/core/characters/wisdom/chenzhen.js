"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChenZhen = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class ChenZhen extends character_1.Character {
    constructor(id) {
        super(id, 'chenzhen', 0 /* Male */, 1 /* Shu */, 3, 3, "wisdom" /* Wisdom */, [
            skillLoaderInstance.getSkillByName('shameng'),
        ]);
    }
}
exports.ChenZhen = ChenZhen;
