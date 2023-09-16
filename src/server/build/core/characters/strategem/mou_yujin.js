"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MouYuJin = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class MouYuJin extends character_1.Character {
    constructor(id) {
        super(id, 'mou_yujin', 0 /* Male */, 0 /* Wei */, 4, 4, "strategem" /* Strategem */, [
            skillLoaderInstance.getSkillByName('xiayuan'),
            skillLoaderInstance.getSkillByName('mou_jieyue'),
        ]);
    }
}
exports.MouYuJin = MouYuJin;
