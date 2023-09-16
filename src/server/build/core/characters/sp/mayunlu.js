"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaYunLu = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLorderInstance = loader_skills_1.SkillLoader.getInstance();
class MaYunLu extends character_1.Character {
    constructor(id) {
        super(id, 'mayunlu', 1 /* Female */, 1 /* Shu */, 4, 4, "sp" /* SP */, [
            skillLorderInstance.getSkillByName('mashu'),
            skillLorderInstance.getSkillByName('fengpo'),
        ]);
    }
}
exports.MaYunLu = MaYunLu;
