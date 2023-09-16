"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XinXinPi = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class XinXinPi extends character_1.Character {
    constructor(id) {
        super(id, 'xin_xinpi', 0 /* Male */, 0 /* Wei */, 3, 3, "sincerity" /* Sincerity */, [
            skillLoaderInstance.getSkillByName('xin_yinju'),
            skillLoaderInstance.getSkillByName('xin_chijie'),
        ]);
    }
}
exports.XinXinPi = XinXinPi;
