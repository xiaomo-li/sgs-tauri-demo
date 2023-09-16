"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HuaXin = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLorderInstance = loader_skills_1.SkillLoader.getInstance();
class HuaXin extends character_1.Character {
    constructor(id) {
        super(id, 'huaxin', 0 /* Male */, 0 /* Wei */, 3, 3, "decade" /* Decade */, [
            ...skillLorderInstance.getSkillsByName('wanggui'),
            skillLorderInstance.getSkillByName('xibing'),
        ]);
    }
}
exports.HuaXin = HuaXin;
