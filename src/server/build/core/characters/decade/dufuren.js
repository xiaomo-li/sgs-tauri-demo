"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DuFuRen = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLorderInstance = loader_skills_1.SkillLoader.getInstance();
class DuFuRen extends character_1.Character {
    constructor(id) {
        super(id, 'dufuren', 1 /* Female */, 0 /* Wei */, 3, 3, "decade" /* Decade */, [
            ...skillLorderInstance.getSkillsByName('yise'),
            ...skillLorderInstance.getSkillsByName('shunshi'),
        ]);
    }
}
exports.DuFuRen = DuFuRen;
