"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaiZhenJi = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class CaiZhenJi extends character_1.Character {
    constructor(id) {
        super(id, 'caizhenji', 1 /* Female */, 0 /* Wei */, 3, 3, "benevolence" /* Benevolence */, [skillLoaderInstance.getSkillByName('sheyi'), skillLoaderInstance.getSkillByName('tianyin')]);
    }
}
exports.CaiZhenJi = CaiZhenJi;
