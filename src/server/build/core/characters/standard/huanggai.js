"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HuangGai = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class HuangGai extends character_1.Character {
    constructor(id) {
        super(id, 'huanggai', 0 /* Male */, 2 /* Wu */, 4, 4, "standard" /* Standard */, [
            skillLoaderInstance.getSkillByName('kurou'),
            ...skillLoaderInstance.getSkillsByName('zhaxiang'),
        ]);
    }
}
exports.HuangGai = HuangGai;
