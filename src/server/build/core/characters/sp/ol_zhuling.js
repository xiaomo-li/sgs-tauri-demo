"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OLZhuLing = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLorderInstance = loader_skills_1.SkillLoader.getInstance();
class OLZhuLing extends character_1.Character {
    constructor(id) {
        super(id, 'ol_zhuling', 0 /* Male */, 0 /* Wei */, 4, 4, "sp" /* SP */, [
            ...skillLorderInstance.getSkillsByName('zhuling_jixian'),
        ]);
    }
}
exports.OLZhuLing = OLZhuLing;
