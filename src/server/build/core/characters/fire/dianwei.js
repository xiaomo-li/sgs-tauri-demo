"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DianWei = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class DianWei extends character_1.Character {
    constructor(id) {
        super(id, 'dianwei', 0 /* Male */, 0 /* Wei */, 4, 4, "fire" /* Fire */, [
            skillLoaderInstance.getSkillByName('qiangxi'),
        ]);
    }
}
exports.DianWei = DianWei;
