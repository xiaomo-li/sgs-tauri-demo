"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SunLuBan = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class SunLuBan extends character_1.Character {
    constructor(id) {
        super(id, 'sunluban', 1 /* Female */, 2 /* Wu */, 3, 3, "yijiang2014" /* YiJiang2014 */, [
            ...skillLoaderInstance.getSkillsByName('zenhui'),
            skillLoaderInstance.getSkillByName('jiaojin'),
        ]);
    }
}
exports.SunLuBan = SunLuBan;
