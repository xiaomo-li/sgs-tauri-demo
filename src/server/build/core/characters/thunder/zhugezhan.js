"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZhuGeZhan = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class ZhuGeZhan extends character_1.Character {
    constructor(id) {
        super(id, 'zhugezhan', 0 /* Male */, 1 /* Shu */, 3, 3, "thunder" /* Thunder */, [
            skillLoaderInstance.getSkillByName('zuilun'),
            ...skillLoaderInstance.getSkillsByName('fuyin'),
        ]);
    }
}
exports.ZhuGeZhan = ZhuGeZhan;
