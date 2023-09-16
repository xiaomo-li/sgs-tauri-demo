"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MouHuangZhong = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class MouHuangZhong extends character_1.Character {
    constructor(id) {
        super(id, 'mou_huangzhong', 0 /* Male */, 1 /* Shu */, 4, 4, "strategem" /* Strategem */, [...skillLoaderInstance.getSkillsByName('mou_liegong')]);
    }
}
exports.MouHuangZhong = MouHuangZhong;
