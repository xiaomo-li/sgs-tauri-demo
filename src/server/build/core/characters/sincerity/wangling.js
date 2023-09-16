"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WangLing = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class WangLing extends character_1.Character {
    constructor(id) {
        super(id, 'wangling', 0 /* Male */, 0 /* Wei */, 4, 4, "sincerity" /* Sincerity */, [
            ...skillLoaderInstance.getSkillsByName('mouli'),
            skillLoaderInstance.getSkillByName('zifu'),
        ]);
    }
}
exports.WangLing = WangLing;
