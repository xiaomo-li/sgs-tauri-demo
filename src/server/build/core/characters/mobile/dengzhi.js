"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DengZhi = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class DengZhi extends character_1.Character {
    constructor(id) {
        super(id, 'dengzhi', 0 /* Male */, 1 /* Shu */, 3, 3, "mobile" /* Mobile */, [
            skillLoaderInstance.getSkillByName('jimeng'),
            skillLoaderInstance.getSkillByName('shuaiyan'),
        ]);
    }
}
exports.DengZhi = DengZhi;
