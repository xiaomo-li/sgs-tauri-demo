"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GanNing = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class GanNing extends character_1.Character {
    constructor(id) {
        super(id, 'ganning', 0 /* Male */, 2 /* Wu */, 4, 4, "standard" /* Standard */, [
            skillLoaderInstance.getSkillByName('qixi'),
            skillLoaderInstance.getSkillByName('fenwei'),
        ]);
    }
}
exports.GanNing = GanNing;
