"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MiFuRen = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class MiFuRen extends character_1.Character {
    constructor(id) {
        super(id, 'mifuren', 1 /* Female */, 1 /* Shu */, 3, 3, "sincerity" /* Sincerity */, [
            skillLoaderInstance.getSkillByName('guixiu'),
            skillLoaderInstance.getSkillByName('qingyu'),
        ]);
    }
}
exports.MiFuRen = MiFuRen;
