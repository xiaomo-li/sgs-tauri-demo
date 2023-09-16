"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZhuGeGuo = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLorderInstance = loader_skills_1.SkillLoader.getInstance();
class ZhuGeGuo extends character_1.Character {
    constructor(id) {
        super(id, 'zhugeguo', 1 /* Female */, 1 /* Shu */, 3, 3, "limited" /* Limited */, [
            ...skillLorderInstance.getSkillsByName('qirang'),
            skillLorderInstance.getSkillByName('yuhua'),
        ]);
    }
}
exports.ZhuGeGuo = ZhuGeGuo;
