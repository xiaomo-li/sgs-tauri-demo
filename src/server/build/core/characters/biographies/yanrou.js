"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YanRou = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class YanRou extends character_1.Character {
    constructor(id) {
        super(id, 'yanrou', 0 /* Male */, 0 /* Wei */, 4, 4, "biographies" /* Biographies */, [
            ...skillLoaderInstance.getSkillsByName('choutao'),
            skillLoaderInstance.getSkillByName('xiangshu'),
        ]);
    }
}
exports.YanRou = YanRou;
