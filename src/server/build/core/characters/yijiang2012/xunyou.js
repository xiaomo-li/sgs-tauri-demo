"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XunYou = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class XunYou extends character_1.Character {
    constructor(id) {
        super(id, 'xunyou', 0 /* Male */, 0 /* Wei */, 3, 3, "yijiang2012" /* YiJiang2012 */, [
            skillLoaderInstance.getSkillByName('qice'),
            skillLoaderInstance.getSkillByName('zhiyu'),
        ]);
    }
}
exports.XunYou = XunYou;
