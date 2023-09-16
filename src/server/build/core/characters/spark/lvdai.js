"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LvDai = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLorderInstance = loader_skills_1.SkillLoader.getInstance();
class LvDai extends character_1.Character {
    constructor(id) {
        super(id, 'lvdai', 0 /* Male */, 2 /* Wu */, 4, 4, "spark" /* Spark */, [
            ...skillLorderInstance.getSkillsByName('qinguo'),
        ]);
    }
}
exports.LvDai = LvDai;
