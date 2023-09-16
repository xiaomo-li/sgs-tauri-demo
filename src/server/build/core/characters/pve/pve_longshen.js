"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PveLongShen = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class PveLongShen extends character_1.Character {
    constructor(id) {
        super(id, 'pve_longshen', 1 /* Female */, 4 /* God */, 3, 3, "pve" /* Pve */, [
            skillLoaderInstance.getSkillByName('pve_longshen_qifu'),
        ]);
    }
}
exports.PveLongShen = PveLongShen;
