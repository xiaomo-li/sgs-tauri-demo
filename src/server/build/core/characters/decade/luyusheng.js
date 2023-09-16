"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LuYuSheng = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLorderInstance = loader_skills_1.SkillLoader.getInstance();
class LuYuSheng extends character_1.Character {
    constructor(id) {
        super(id, 'luyusheng', 1 /* Female */, 2 /* Wu */, 3, 3, "decade" /* Decade */, [
            skillLorderInstance.getSkillByName('zhente'),
            ...skillLorderInstance.getSkillsByName('zhiwei'),
        ]);
    }
}
exports.LuYuSheng = LuYuSheng;
