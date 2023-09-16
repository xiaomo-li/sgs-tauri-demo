"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SunDeng = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class SunDeng extends character_1.Character {
    constructor(id) {
        super(id, 'sundeng', 0 /* Male */, 2 /* Wu */, 4, 4, "yuan6" /* Yuan6 */, [
            ...skillLoaderInstance.getSkillsByName('kuangbi'),
        ]);
    }
}
exports.SunDeng = SunDeng;
