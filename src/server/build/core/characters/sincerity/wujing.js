"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WuJing = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class WuJing extends character_1.Character {
    constructor(id) {
        super(id, 'wujing', 0 /* Male */, 2 /* Wu */, 4, 4, "sincerity" /* Sincerity */, [
            ...skillLoaderInstance.getSkillsByName('heji'),
            skillLoaderInstance.getSkillByName('liubing'),
        ]);
    }
}
exports.WuJing = WuJing;
