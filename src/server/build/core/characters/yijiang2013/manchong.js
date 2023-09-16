"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManChong = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const junxing_1 = require("core/skills/characters/yijiang2013/junxing");
const yuce_1 = require("core/skills/characters/yijiang2013/yuce");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class ManChong extends character_1.Character {
    constructor(id) {
        super(id, 'manchong', 0 /* Male */, 0 /* Wei */, 3, 3, "yijiang2013" /* YiJiang2013 */, [
            skillLoaderInstance.getSkillByName(junxing_1.JunXing.Name),
            skillLoaderInstance.getSkillByName(yuce_1.YuCe.Name),
        ]);
    }
}
exports.ManChong = ManChong;
