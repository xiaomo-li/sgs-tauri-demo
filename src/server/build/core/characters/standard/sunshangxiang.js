"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SunShangXiang = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class SunShangXiang extends character_1.Character {
    constructor(id) {
        super(id, 'sunshangxiang', 1 /* Female */, 2 /* Wu */, 3, 3, "standard" /* Standard */, [skillLoaderInstance.getSkillByName('jieyin'), skillLoaderInstance.getSkillByName('xiaoji')]);
    }
}
exports.SunShangXiang = SunShangXiang;
