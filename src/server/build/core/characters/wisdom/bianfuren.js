"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BianFuRen = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class BianFuRen extends character_1.Character {
    constructor(id) {
        super(id, 'bianfuren', 1 /* Female */, 0 /* Wei */, 3, 3, "wisdom" /* Wisdom */, [
            ...skillLoaderInstance.getSkillsByName('wanwei'),
            ...skillLoaderInstance.getSkillsByName('yuejian'),
        ]);
    }
}
exports.BianFuRen = BianFuRen;
