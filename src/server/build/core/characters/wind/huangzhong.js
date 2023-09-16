"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HuangZhong = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class HuangZhong extends character_1.Character {
    constructor(id) {
        super(id, 'huangzhong', 0 /* Male */, 1 /* Shu */, 4, 4, "wind" /* Wind */, [
            ...skillLoaderInstance.getSkillsByName('liegong'),
        ]);
    }
}
exports.HuangZhong = HuangZhong;
