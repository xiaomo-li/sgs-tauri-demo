"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZhouTai = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class ZhouTai extends character_1.Character {
    constructor(id) {
        super(id, 'zhoutai', 0 /* Male */, 2 /* Wu */, 4, 4, "wind" /* Wind */, [
            skillLoaderInstance.getSkillByName('fenji'),
            ...skillLoaderInstance.getSkillsByName('buqu'),
        ]);
    }
}
exports.ZhouTai = ZhouTai;
