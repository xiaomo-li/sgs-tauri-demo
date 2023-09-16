"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SPCaiWenJi = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLorderInstance = loader_skills_1.SkillLoader.getInstance();
class SPCaiWenJi extends character_1.Character {
    constructor(id) {
        super(id, 'sp_caiwenji', 1 /* Female */, 0 /* Wei */, 3, 3, "sp" /* SP */, [
            skillLorderInstance.getSkillByName('chenqing'),
            skillLorderInstance.getSkillByName('mozhi'),
        ]);
    }
}
exports.SPCaiWenJi = SPCaiWenJi;
