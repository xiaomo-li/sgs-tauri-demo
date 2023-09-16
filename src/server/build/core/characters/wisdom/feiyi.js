"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeiYi = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class FeiYi extends character_1.Character {
    constructor(id) {
        super(id, 'feiyi', 0 /* Male */, 1 /* Shu */, 3, 3, "wisdom" /* Wisdom */, [
            ...skillLoaderInstance.getSkillsByName('jianyu'),
            skillLoaderInstance.getSkillByName('shengxi'),
        ]);
    }
}
exports.FeiYi = FeiYi;
