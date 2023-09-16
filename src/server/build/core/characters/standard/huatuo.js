"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HuaTuo = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class HuaTuo extends character_1.Character {
    constructor(id) {
        super(id, 'huatuo', 0 /* Male */, 3 /* Qun */, 3, 3, "standard" /* Standard */, [
            skillLoaderInstance.getSkillByName('jijiu'),
            ...skillLoaderInstance.getSkillsByName('qingnang'),
        ]);
    }
}
exports.HuaTuo = HuaTuo;
