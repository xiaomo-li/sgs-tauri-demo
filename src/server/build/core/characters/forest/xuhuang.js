"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XuHuang = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class XuHuang extends character_1.Character {
    constructor(id) {
        super(id, 'xuhuang', 0 /* Male */, 0 /* Wei */, 4, 4, "forest" /* Forest */, [
            ...skillLoaderInstance.getSkillsByName('duanliang'),
            skillLoaderInstance.getSkillByName('jiezi'),
        ]);
    }
}
exports.XuHuang = XuHuang;
