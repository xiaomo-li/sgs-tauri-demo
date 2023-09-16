"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SunZiLiuFang = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class SunZiLiuFang extends character_1.Character {
    constructor(id) {
        super(id, 'sunziliufang', 0 /* Male */, 0 /* Wei */, 3, 3, "yuan6" /* Yuan6 */, [
            skillLoaderInstance.getSkillByName('guizao'),
            ...skillLoaderInstance.getSkillsByName('jiyu'),
        ]);
    }
}
exports.SunZiLiuFang = SunZiLiuFang;
