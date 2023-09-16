"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MiZhu = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLorderInstance = loader_skills_1.SkillLoader.getInstance();
class MiZhu extends character_1.Character {
    constructor(id) {
        super(id, 'mizhu', 0 /* Male */, 1 /* Shu */, 3, 3, "sp" /* SP */, [
            skillLorderInstance.getSkillByName('ziyuan'),
            ...skillLorderInstance.getSkillsByName('jugu'),
        ]);
    }
}
exports.MiZhu = MiZhu;
