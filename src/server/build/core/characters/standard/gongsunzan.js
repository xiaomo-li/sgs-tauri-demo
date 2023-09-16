"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GongSunZan = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class GongSunZan extends character_1.Character {
    constructor(id) {
        super(id, 'gongsunzan', 0 /* Male */, 3 /* Qun */, 4, 4, "standard" /* Standard */, [
            skillLoaderInstance.getSkillByName('yicong'),
            skillLoaderInstance.getSkillByName('qiaomeng'),
        ]);
    }
}
exports.GongSunZan = GongSunZan;
