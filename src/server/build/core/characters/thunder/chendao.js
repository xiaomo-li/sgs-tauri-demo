"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChenDao = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class ChenDao extends character_1.Character {
    constructor(id) {
        super(id, 'chendao', 0 /* Male */, 1 /* Shu */, 4, 4, "thunder" /* Thunder */, [
            ...skillLoaderInstance.getSkillsByName('wanglie'),
        ]);
    }
}
exports.ChenDao = ChenDao;
