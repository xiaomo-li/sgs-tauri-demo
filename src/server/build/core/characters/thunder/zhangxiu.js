"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZhangXiu = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class ZhangXiu extends character_1.Character {
    constructor(id) {
        super(id, 'zhangxiu', 0 /* Male */, 3 /* Qun */, 4, 4, "thunder" /* Thunder */, [
            skillLoaderInstance.getSkillByName('congjian'),
            ...skillLoaderInstance.getSkillsByName('xiongluan'),
        ]);
    }
}
exports.ZhangXiu = ZhangXiu;
