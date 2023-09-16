"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WangFuZhaoLei = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class WangFuZhaoLei extends character_1.Character {
    constructor(id) {
        super(id, 'wangfuzhaolei', 0 /* Male */, 1 /* Shu */, 4, 4, "sincerity" /* Sincerity */, [...skillLoaderInstance.getSkillsByName('xunyi')]);
    }
}
exports.WangFuZhaoLei = WangFuZhaoLei;
