"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LvMeng = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class LvMeng extends character_1.Character {
    constructor(id) {
        super(id, 'lvmeng', 0 /* Male */, 2 /* Wu */, 4, 4, "standard" /* Standard */, [
            skillLoaderInstance.getSkillByName('keji'),
            skillLoaderInstance.getSkillByName('qinxue'),
            skillLoaderInstance.getSkillByName('botu'),
        ]);
    }
}
exports.LvMeng = LvMeng;
