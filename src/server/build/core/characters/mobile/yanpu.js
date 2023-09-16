"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YanPu = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class YanPu extends character_1.Character {
    constructor(id) {
        super(id, 'yanpu', 0 /* Male */, 3 /* Qun */, 3, 3, "mobile" /* Mobile */, [
            ...skillLoaderInstance.getSkillsByName('huantu'),
            skillLoaderInstance.getSkillByName('bihuo'),
        ]);
    }
}
exports.YanPu = YanPu;
