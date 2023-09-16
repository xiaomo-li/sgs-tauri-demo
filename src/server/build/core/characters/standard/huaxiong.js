"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HuaXiong = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class HuaXiong extends character_1.Character {
    constructor(id) {
        super(id, 'huaxiong', 0 /* Male */, 3 /* Qun */, 6, 6, "standard" /* Standard */, [
            skillLoaderInstance.getSkillByName('yaowu'),
        ]);
    }
}
exports.HuaXiong = HuaXiong;
