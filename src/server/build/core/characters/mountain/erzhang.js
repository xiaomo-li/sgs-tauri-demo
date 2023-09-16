"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErZhang = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class ErZhang extends character_1.Character {
    constructor(id) {
        super(id, 'zhangzhaozhanghong', 0 /* Male */, 2 /* Wu */, 3, 3, "mountain" /* Mountain */, [...skillLoaderInstance.getSkillsByName('zhijian'), skillLoaderInstance.getSkillByName('guzheng')]);
    }
}
exports.ErZhang = ErZhang;
