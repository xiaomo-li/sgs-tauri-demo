"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XiaHouDun = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class XiaHouDun extends character_1.Character {
    constructor(id) {
        super(id, 'xiahoudun', 0 /* Male */, 0 /* Wei */, 4, 4, "standard" /* Standard */, [
            skillLoaderInstance.getSkillByName('ganglie'),
            ...skillLoaderInstance.getSkillsByName('qingjian'),
        ]);
    }
}
exports.XiaHouDun = XiaHouDun;
