"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SunJian = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class SunJian extends character_1.Character {
    constructor(id) {
        super(id, 'sunjian', 0 /* Male */, 2 /* Wu */, 5, 4, "forest" /* Forest */, [
            skillLoaderInstance.getSkillByName('yinghun'),
            skillLoaderInstance.getSkillByName('wulie'),
        ]);
    }
}
exports.SunJian = SunJian;
