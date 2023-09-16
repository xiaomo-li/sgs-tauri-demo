"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChengPu = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class ChengPu extends character_1.Character {
    constructor(id) {
        super(id, 'chengpu', 0 /* Male */, 2 /* Wu */, 4, 4, "yijiang2012" /* YiJiang2012 */, [
            ...skillLoaderInstance.getSkillsByName('lihuo'),
            ...skillLoaderInstance.getSkillsByName('chunlao'),
        ]);
    }
}
exports.ChengPu = ChengPu;
