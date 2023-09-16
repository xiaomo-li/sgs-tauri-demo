"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NiuJin = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLorderInstance = loader_skills_1.SkillLoader.getInstance();
class NiuJin extends character_1.Character {
    constructor(id) {
        super(id, 'niujin', 0 /* Male */, 0 /* Wei */, 4, 4, "decade" /* Decade */, [
            skillLorderInstance.getSkillByName('cuirui'),
            skillLorderInstance.getSkillByName('liewei'),
        ]);
    }
}
exports.NiuJin = NiuJin;
