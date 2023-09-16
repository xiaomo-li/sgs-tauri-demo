"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FengXi = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLorderInstance = loader_skills_1.SkillLoader.getInstance();
class FengXi extends character_1.Character {
    constructor(id) {
        super(id, 'fengxi', 0 /* Male */, 2 /* Wu */, 3, 3, "decade" /* Decade */, [
            skillLorderInstance.getSkillByName('yusui'),
            skillLorderInstance.getSkillByName('boyan'),
        ]);
    }
}
exports.FengXi = FengXi;
