"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YangHuiYu = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class YangHuiYu extends character_1.Character {
    constructor(id) {
        super(id, 'yanghuiyu', 1 /* Female */, 0 /* Wei */, 3, 3, "mobile" /* Mobile */, [
            ...skillLoaderInstance.getSkillsByName('hongyi'),
            skillLoaderInstance.getSkillByName('quanfeng'),
        ]);
    }
}
exports.YangHuiYu = YangHuiYu;
