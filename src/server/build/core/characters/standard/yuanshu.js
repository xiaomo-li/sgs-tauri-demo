"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YuanShu = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class YuanShu extends character_1.Character {
    constructor(id) {
        super(id, 'yuanshu', 0 /* Male */, 3 /* Qun */, 4, 4, "standard" /* Standard */, [
            ...skillLoaderInstance.getSkillsByName('wangzun'),
            skillLoaderInstance.getSkillByName('tongji'),
        ]);
    }
}
exports.YuanShu = YuanShu;
