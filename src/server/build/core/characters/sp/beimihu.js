"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeiMiHu = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLorderInstance = loader_skills_1.SkillLoader.getInstance();
class BeiMiHu extends character_1.Character {
    constructor(id) {
        super(id, 'beimihu', 1 /* Female */, 3 /* Qun */, 3, 3, "sp" /* SP */, [
            skillLorderInstance.getSkillByName('zongkui'),
            skillLorderInstance.getSkillByName('guju'),
            skillLorderInstance.getSkillByName('baijia'),
        ]);
    }
}
exports.BeiMiHu = BeiMiHu;
