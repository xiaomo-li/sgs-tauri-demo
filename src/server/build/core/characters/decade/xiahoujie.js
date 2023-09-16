"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XiaHouJie = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLorderInstance = loader_skills_1.SkillLoader.getInstance();
class XiaHouJie extends character_1.Character {
    constructor(id) {
        super(id, 'xiahoujie', 0 /* Male */, 0 /* Wei */, 5, 5, "decade" /* Decade */, [
            skillLorderInstance.getSkillByName('liedan'),
            ...skillLorderInstance.getSkillsByName('zhuangdan'),
        ]);
    }
}
exports.XiaHouJie = XiaHouJie;
