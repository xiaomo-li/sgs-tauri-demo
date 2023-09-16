"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KuaiYueKuaiLiang = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class KuaiYueKuaiLiang extends character_1.Character {
    constructor(id) {
        super(id, 'kuaiyuekuailiang', 0 /* Male */, 0 /* Wei */, 3, 3, "shadow" /* Shadow */, [skillLoaderInstance.getSkillByName('jianxiang'), ...skillLoaderInstance.getSkillsByName('shenshi')]);
    }
}
exports.KuaiYueKuaiLiang = KuaiYueKuaiLiang;
