"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MobileFuRong = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class MobileFuRong extends character_1.Character {
    constructor(id) {
        super(id, 'mobile_furong', 0 /* Male */, 1 /* Shu */, 4, 4, "mobile" /* Mobile */, [
            ...skillLoaderInstance.getSkillsByName('xuewei'),
            skillLoaderInstance.getSkillByName('liechi'),
        ]);
    }
}
exports.MobileFuRong = MobileFuRong;
