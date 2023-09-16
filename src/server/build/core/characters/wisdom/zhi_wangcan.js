"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZhiWangCan = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class ZhiWangCan extends character_1.Character {
    constructor(id) {
        super(id, 'zhi_wangcan', 0 /* Male */, 0 /* Wei */, 3, 3, "wisdom" /* Wisdom */, [
            skillLoaderInstance.getSkillByName('zhi_qiai'),
            ...skillLoaderInstance.getSkillsByName('zhi_shanxi'),
        ]);
    }
}
exports.ZhiWangCan = ZhiWangCan;
