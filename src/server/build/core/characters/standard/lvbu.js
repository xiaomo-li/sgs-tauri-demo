"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LvBu = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class LvBu extends character_1.Character {
    constructor(id) {
        super(id, 'lvbu', 0 /* Male */, 3 /* Qun */, 5, 5, "standard" /* Standard */, [
            skillLoaderInstance.getSkillByName('liyu'),
            ...skillLoaderInstance.getSkillsByName('wushuang'),
        ]);
    }
}
exports.LvBu = LvBu;
