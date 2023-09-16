"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecadeLuoTong = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLorderInstance = loader_skills_1.SkillLoader.getInstance();
class DecadeLuoTong extends character_1.Character {
    constructor(id) {
        super(id, 'decade_luotong', 0 /* Male */, 2 /* Wu */, 4, 4, "limited" /* Limited */, [
            skillLorderInstance.getSkillByName('renzheng'),
            ...skillLorderInstance.getSkillsByName('jinjian'),
        ]);
    }
}
exports.DecadeLuoTong = DecadeLuoTong;
