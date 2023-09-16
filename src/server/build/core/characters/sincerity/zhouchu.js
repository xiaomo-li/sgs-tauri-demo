"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZhouChu = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class ZhouChu extends character_1.Character {
    constructor(id) {
        super(id, 'zhouchu', 0 /* Male */, 2 /* Wu */, 4, 4, "sincerity" /* Sincerity */, [
            ...skillLoaderInstance.getSkillsByName('xianghai'),
            ...skillLoaderInstance.getSkillsByName('chuhai'),
        ]);
    }
}
exports.ZhouChu = ZhouChu;
