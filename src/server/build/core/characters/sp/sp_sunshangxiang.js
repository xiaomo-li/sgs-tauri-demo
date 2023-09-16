"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SPSunShangXiang = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLorderInstance = loader_skills_1.SkillLoader.getInstance();
class SPSunShangXiang extends character_1.Character {
    constructor(id) {
        super(id, 'sp_sunshangxiang', 1 /* Female */, 1 /* Shu */, 3, 3, "sp" /* SP */, [
            skillLorderInstance.getSkillByName('liangzhu'),
            skillLorderInstance.getSkillByName('fanxiang'),
        ]);
    }
}
exports.SPSunShangXiang = SPSunShangXiang;
