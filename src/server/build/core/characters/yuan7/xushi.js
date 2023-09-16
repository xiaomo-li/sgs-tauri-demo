"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XuShi = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class XuShi extends character_1.Character {
    constructor(id) {
        super(id, 'xushi', 1 /* Female */, 2 /* Wu */, 3, 3, "yuan7" /* Yuan7 */, [
            ...skillLoaderInstance.getSkillsByName('wengua'),
            skillLoaderInstance.getSkillByName('fuzhu'),
        ]);
    }
}
exports.XuShi = XuShi;
