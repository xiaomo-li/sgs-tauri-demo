"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lusu = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class Lusu extends character_1.Character {
    constructor(id) {
        super(id, 'lusu', 0 /* Male */, 2 /* Wu */, 3, 3, "forest" /* Forest */, [
            ...skillLoaderInstance.getSkillsByName('haoshi'),
            skillLoaderInstance.getSkillByName('dimeng'),
        ]);
    }
}
exports.Lusu = Lusu;
