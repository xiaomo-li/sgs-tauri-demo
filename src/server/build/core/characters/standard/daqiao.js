"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DaQiao = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class DaQiao extends character_1.Character {
    constructor(id) {
        super(id, 'daqiao', 1 /* Female */, 2 /* Wu */, 3, 3, "standard" /* Standard */, [
            skillLoaderInstance.getSkillByName('guose'),
            skillLoaderInstance.getSkillByName('liuli'),
        ]);
    }
}
exports.DaQiao = DaQiao;
