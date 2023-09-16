"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MouLvMeng = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class MouLvMeng extends character_1.Character {
    constructor(id) {
        super(id, 'mou_lvmeng', 0 /* Male */, 2 /* Wu */, 4, 4, "strategem" /* Strategem */, [
            ...skillLoaderInstance.getSkillsByName('mou_keji'),
            skillLoaderInstance.getSkillByName('dujiang'),
        ]);
    }
}
exports.MouLvMeng = MouLvMeng;
