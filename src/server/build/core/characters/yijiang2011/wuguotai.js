"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WuGuoTai = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class WuGuoTai extends character_1.Character {
    constructor(id) {
        super(id, 'wuguotai', 1 /* Female */, 2 /* Wu */, 3, 3, "yijiang2011" /* YiJiang2011 */, [
            skillLoaderInstance.getSkillByName('ganlu'),
            skillLoaderInstance.getSkillByName('buyi'),
        ]);
    }
}
exports.WuGuoTai = WuGuoTai;
