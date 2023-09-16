"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FanYuFeng = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLorderInstance = loader_skills_1.SkillLoader.getInstance();
class FanYuFeng extends character_1.Character {
    constructor(id) {
        super(id, 'fanyufeng', 1 /* Female */, 3 /* Qun */, 3, 3, "limited" /* Limited */, [
            skillLorderInstance.getSkillByName('bazhan'),
            ...skillLorderInstance.getSkillsByName('jiaoying'),
        ]);
    }
}
exports.FanYuFeng = FanYuFeng;
