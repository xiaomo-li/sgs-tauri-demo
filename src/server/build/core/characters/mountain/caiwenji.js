"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaiWenJi = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class CaiWenJi extends character_1.Character {
    constructor(id) {
        super(id, 'caiwenji', 1 /* Female */, 3 /* Qun */, 3, 3, "mountain" /* Mountain */, [
            skillLoaderInstance.getSkillByName('beige'),
            skillLoaderInstance.getSkillByName('duanchang'),
        ]);
    }
}
exports.CaiWenJi = CaiWenJi;
