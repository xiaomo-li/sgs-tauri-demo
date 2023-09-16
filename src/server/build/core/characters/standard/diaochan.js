"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiaoChan = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class DiaoChan extends character_1.Character {
    constructor(id) {
        super(id, 'diaochan', 1 /* Female */, 3 /* Qun */, 3, 3, "standard" /* Standard */, [
            skillLoaderInstance.getSkillByName('lijian'),
            skillLoaderInstance.getSkillByName('biyue'),
        ]);
    }
}
exports.DiaoChan = DiaoChan;
