"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecadeLiuBa = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLorderInstance = loader_skills_1.SkillLoader.getInstance();
class DecadeLiuBa extends character_1.Character {
    constructor(id) {
        super(id, 'decade_liuba', 0 /* Male */, 1 /* Shu */, 3, 3, "decade" /* Decade */, [
            skillLorderInstance.getSkillByName('zhubi'),
            ...skillLorderInstance.getSkillsByName('liuzhuan'),
        ]);
    }
}
exports.DecadeLiuBa = DecadeLiuBa;
