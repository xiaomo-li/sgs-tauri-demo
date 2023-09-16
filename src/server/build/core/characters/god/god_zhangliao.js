"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GodZhangLiao = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class GodZhangLiao extends character_1.Character {
    constructor(id) {
        super(id, 'god_zhangliao', 0 /* Male */, 4 /* God */, 4, 4, "god" /* God */, [
            ...skillLoaderInstance.getSkillsByName('duorui'),
            ...skillLoaderInstance.getSkillsByName('zhiti'),
        ]);
    }
}
exports.GodZhangLiao = GodZhangLiao;
