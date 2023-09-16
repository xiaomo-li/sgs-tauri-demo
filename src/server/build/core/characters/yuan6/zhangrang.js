"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZhangRang = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class ZhangRang extends character_1.Character {
    constructor(id) {
        super(id, 'zhangrang', 0 /* Male */, 3 /* Qun */, 3, 3, "yuan6" /* Yuan6 */, [
            ...skillLoaderInstance.getSkillsByName('taoluan'),
        ]);
    }
}
exports.ZhangRang = ZhangRang;
