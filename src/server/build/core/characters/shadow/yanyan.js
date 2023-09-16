"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YanYan = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class YanYan extends character_1.Character {
    constructor(id) {
        super(id, 'yanyan', 0 /* Male */, 1 /* Shu */, 4, 4, "shadow" /* Shadow */, [
            ...skillLoaderInstance.getSkillsByName('juzhan'),
        ]);
    }
}
exports.YanYan = YanYan;
