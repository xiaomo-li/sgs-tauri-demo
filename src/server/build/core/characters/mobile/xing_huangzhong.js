"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XingHuangZhong = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class XingHuangZhong extends character_1.Character {
    constructor(id) {
        super(id, 'xing_huangzhong', 0 /* Male */, 3 /* Qun */, 4, 4, "mobile" /* Mobile */, [
            ...skillLoaderInstance.getSkillsByName('shidi'),
            skillLoaderInstance.getSkillByName('xing_yishi'),
            ...skillLoaderInstance.getSkillsByName('qishe'),
        ]);
    }
}
exports.XingHuangZhong = XingHuangZhong;
