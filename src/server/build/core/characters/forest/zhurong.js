"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZhuRong = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class ZhuRong extends character_1.Character {
    constructor(id) {
        super(id, 'zhurong', 1 /* Female */, 1 /* Shu */, 4, 4, "forest" /* Forest */, [
            skillLoaderInstance.getSkillByName('juxiang'),
            skillLoaderInstance.getSkillByName('lieren'),
        ]);
    }
}
exports.ZhuRong = ZhuRong;
