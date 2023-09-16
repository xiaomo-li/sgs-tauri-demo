"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LvLingQi = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLorderInstance = loader_skills_1.SkillLoader.getInstance();
class LvLingQi extends character_1.Character {
    constructor(id) {
        super(id, 'lvlingqi', 1 /* Female */, 3 /* Qun */, 4, 4, "decade" /* Decade */, [
            ...skillLorderInstance.getSkillsByName('guowu'),
            skillLorderInstance.getSkillByName('zhuangrong'),
        ]);
    }
}
exports.LvLingQi = LvLingQi;
