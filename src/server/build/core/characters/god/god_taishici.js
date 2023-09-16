"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GodTaiShiCi = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class GodTaiShiCi extends character_1.Character {
    constructor(id) {
        super(id, 'god_taishici', 0 /* Male */, 4 /* God */, 4, 4, "god" /* God */, [
            skillLoaderInstance.getSkillByName('dulie'),
            ...skillLoaderInstance.getSkillsByName('powei'),
        ]);
    }
}
exports.GodTaiShiCi = GodTaiShiCi;
