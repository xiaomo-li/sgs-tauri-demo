"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WuTuGu = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLorderInstance = loader_skills_1.SkillLoader.getInstance();
class WuTuGu extends character_1.Character {
    constructor(id) {
        super(id, 'wutugu', 0 /* Male */, 3 /* Qun */, 15, 15, "sp" /* SP */, [
            skillLorderInstance.getSkillByName('ranshang'),
            skillLorderInstance.getSkillByName('hanyong'),
        ]);
    }
}
exports.WuTuGu = WuTuGu;
