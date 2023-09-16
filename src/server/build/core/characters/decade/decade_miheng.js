"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecadeMiHeng = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLorderInstance = loader_skills_1.SkillLoader.getInstance();
class DecadeMiHeng extends character_1.Character {
    constructor(id) {
        super(id, 'decade_miheng', 0 /* Male */, 3 /* Qun */, 3, 3, "decade" /* Decade */, [
            ...skillLorderInstance.getSkillsByName('decade_kuangcai'),
            skillLorderInstance.getSkillByName('decade_shejian'),
        ]);
    }
}
exports.DecadeMiHeng = DecadeMiHeng;
