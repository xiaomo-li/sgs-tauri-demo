"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZhongYao = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class ZhongYao extends character_1.Character {
    constructor(id) {
        super(id, 'zhongyao', 0 /* Male */, 0 /* Wei */, 3, 3, "yijiang2015" /* YiJiang2015 */, [
            ...skillLoaderInstance.getSkillsByName('huomo'),
            skillLoaderInstance.getSkillByName('zuoding'),
        ]);
    }
}
exports.ZhongYao = ZhongYao;
