"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YueJin = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLorderInstance = loader_skills_1.SkillLoader.getInstance();
class YueJin extends character_1.Character {
    constructor(id) {
        super(id, 'yuejin', 0 /* Male */, 0 /* Wei */, 4, 4, "sp" /* SP */, [
            skillLorderInstance.getSkillByName('xiaoguo'),
        ]);
    }
}
exports.YueJin = YueJin;
