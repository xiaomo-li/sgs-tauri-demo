"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PangTong = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class PangTong extends character_1.Character {
    constructor(id) {
        super(id, 'pangtong', 0 /* Male */, 1 /* Shu */, 3, 3, "fire" /* Fire */, [
            ...skillLoaderInstance.getSkillsByName('lianhuan'),
            skillLoaderInstance.getSkillByName('niepan'),
        ]);
    }
}
exports.PangTong = PangTong;
