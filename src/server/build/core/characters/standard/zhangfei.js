"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZhangFei = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class ZhangFei extends character_1.Character {
    constructor(id) {
        super(id, 'zhangfei', 0 /* Male */, 1 /* Shu */, 4, 4, "standard" /* Standard */, [
            ...skillLoaderInstance.getSkillsByName('paoxiao'),
            skillLoaderInstance.getSkillByName('tishen'),
        ]);
    }
}
exports.ZhangFei = ZhangFei;
