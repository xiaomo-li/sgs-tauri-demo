"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XuSheng = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class XuSheng extends character_1.Character {
    constructor(id) {
        super(id, 'xusheng', 0 /* Male */, 2 /* Wu */, 4, 4, "yijiang2011" /* YiJiang2011 */, [
            ...skillLoaderInstance.getSkillsByName('pojun'),
        ]);
    }
}
exports.XuSheng = XuSheng;
