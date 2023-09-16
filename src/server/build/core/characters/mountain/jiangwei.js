"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JiangWei = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class JiangWei extends character_1.Character {
    constructor(id) {
        super(id, 'jiangwei', 0 /* Male */, 1 /* Shu */, 4, 4, "mountain" /* Mountain */, [
            ...skillLoaderInstance.getSkillsByName('tiaoxin'),
            skillLoaderInstance.getSkillByName('zhiji'),
        ]);
    }
}
exports.JiangWei = JiangWei;
