"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XueZong = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class XueZong extends character_1.Character {
    constructor(id) {
        super(id, 'xuezong', 0 /* Male */, 2 /* Wu */, 3, 3, "yuan7" /* Yuan7 */, [
            skillLoaderInstance.getSkillByName('funan'),
            skillLoaderInstance.getSkillByName('jiexun'),
        ]);
    }
}
exports.XueZong = XueZong;
