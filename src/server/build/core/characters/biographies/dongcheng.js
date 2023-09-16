"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DongCheng = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class DongCheng extends character_1.Character {
    constructor(id) {
        super(id, 'dongcheng', 0 /* Male */, 3 /* Qun */, 4, 4, "biographies" /* Biographies */, [
            ...skillLoaderInstance.getSkillsByName('xuezhao'),
        ]);
    }
}
exports.DongCheng = DongCheng;
