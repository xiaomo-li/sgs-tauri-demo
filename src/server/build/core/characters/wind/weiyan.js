"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Weiyan = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class Weiyan extends character_1.Character {
    constructor(id) {
        super(id, 'weiyan', 0 /* Male */, 1 /* Shu */, 4, 4, "wind" /* Wind */, [
            ...skillLoaderInstance.getSkillsByName('kuanggu'),
            ...skillLoaderInstance.getSkillsByName('qimou'),
        ]);
    }
}
exports.Weiyan = Weiyan;
