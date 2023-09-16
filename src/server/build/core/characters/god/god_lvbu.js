"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GodLvBu = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class GodLvBu extends character_1.Character {
    constructor(id) {
        super(id, 'god_lvbu', 0 /* Male */, 4 /* God */, 5, 5, "god" /* God */, [
            skillLoaderInstance.getSkillByName('kuangbao'),
            skillLoaderInstance.getSkillByName('wumou'),
            skillLoaderInstance.getSkillByName('shenfen'),
            ...skillLoaderInstance.getSkillsByName('wuqian'),
        ]);
    }
}
exports.GodLvBu = GodLvBu;
