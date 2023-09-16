"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FengYu = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLorderInstance = loader_skills_1.SkillLoader.getInstance();
class FengYu extends character_1.Character {
    constructor(id) {
        super(id, 'fengyu', 1 /* Female */, 3 /* Qun */, 3, 3, "limited" /* Limited */, [
            skillLorderInstance.getSkillByName('tiqi'),
            skillLorderInstance.getSkillByName('baoshu'),
        ]);
    }
}
exports.FengYu = FengYu;
