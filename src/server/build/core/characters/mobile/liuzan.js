"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiuZan = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class LiuZan extends character_1.Character {
    constructor(id) {
        super(id, 'liuzan', 0 /* Male */, 2 /* Wu */, 4, 4, "mobile" /* Mobile */, [
            ...skillLoaderInstance.getSkillsByName('fenyin'),
        ]);
    }
}
exports.LiuZan = LiuZan;
