"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PanShu = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLorderInstance = loader_skills_1.SkillLoader.getInstance();
class PanShu extends character_1.Character {
    constructor(id) {
        super(id, 'panshu', 1 /* Female */, 2 /* Wu */, 3, 3, "limited" /* Limited */, [
            skillLorderInstance.getSkillByName('weiyi'),
            ...skillLorderInstance.getSkillsByName('jinzhi'),
        ]);
    }
}
exports.PanShu = PanShu;
