"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LuoTong = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class LuoTong extends character_1.Character {
    constructor(id) {
        super(id, 'luotong', 0 /* Male */, 2 /* Wu */, 4, 4, "wisdom" /* Wisdom */, [
            ...skillLoaderInstance.getSkillsByName('qinzheng'),
        ]);
    }
}
exports.LuoTong = LuoTong;
