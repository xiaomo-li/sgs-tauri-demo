"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YuJi = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class YuJi extends character_1.Character {
    constructor(id) {
        super(id, 'yuji', 0 /* Male */, 3 /* Qun */, 3, 3, "wind" /* Wind */, [
            ...skillLoaderInstance.getSkillsByName('guhuo'),
        ]);
    }
}
exports.YuJi = YuJi;
