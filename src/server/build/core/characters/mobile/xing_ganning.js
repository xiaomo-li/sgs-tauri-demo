"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XingGanNing = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class XingGanNing extends character_1.Character {
    constructor(id) {
        super(id, 'xing_ganning', 0 /* Male */, 3 /* Qun */, 4, 4, "mobile" /* Mobile */, [
            ...skillLoaderInstance.getSkillsByName('jinfan'),
            skillLoaderInstance.getSkillByName('sheque'),
        ]);
    }
}
exports.XingGanNing = XingGanNing;
