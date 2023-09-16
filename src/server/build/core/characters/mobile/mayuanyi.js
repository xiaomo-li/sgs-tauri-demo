"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaYuanYi = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class MaYuanYi extends character_1.Character {
    constructor(id) {
        super(id, 'mayuanyi', 0 /* Male */, 3 /* Qun */, 4, 4, "mobile" /* Mobile */, [
            ...skillLoaderInstance.getSkillsByName('jibing'),
            skillLoaderInstance.getSkillByName('wangjing'),
            skillLoaderInstance.getSkillByName('moucuan'),
        ]);
    }
}
exports.MaYuanYi = MaYuanYi;
