"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YiJi = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class YiJi extends character_1.Character {
    constructor(id) {
        super(id, 'yiji_c', 0 /* Male */, 1 /* Shu */, 3, 3, "standard" /* Standard */, [
            skillLoaderInstance.getSkillByName('jijie'),
            skillLoaderInstance.getSkillByName('jiyuan'),
        ]);
    }
}
exports.YiJi = YiJi;
