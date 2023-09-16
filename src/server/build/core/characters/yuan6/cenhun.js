"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CenHun = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class CenHun extends character_1.Character {
    constructor(id) {
        super(id, 'cenhun', 0 /* Male */, 2 /* Wu */, 3, 3, "yuan6" /* Yuan6 */, [
            ...skillLoaderInstance.getSkillsByName('jishe'),
            skillLoaderInstance.getSkillByName('lianhuo'),
        ]);
    }
}
exports.CenHun = CenHun;
