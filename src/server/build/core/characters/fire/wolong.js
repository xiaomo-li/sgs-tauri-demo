"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WoLong = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class WoLong extends character_1.Character {
    constructor(id) {
        super(id, 'wolong', 0 /* Male */, 1 /* Shu */, 3, 3, "fire" /* Fire */, [
            skillLoaderInstance.getSkillByName('bazhen'),
            skillLoaderInstance.getSkillByName('huoji'),
            skillLoaderInstance.getSkillByName('kanpo'),
            ...skillLoaderInstance.getSkillsByName('cangzhuo'),
        ]);
    }
}
exports.WoLong = WoLong;
