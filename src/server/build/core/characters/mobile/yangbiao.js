"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YangBiao = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class YangBiao extends character_1.Character {
    constructor(id) {
        super(id, 'yangbiao', 0 /* Male */, 3 /* Qun */, 3, 3, "mobile" /* Mobile */, [
            skillLoaderInstance.getSkillByName('zhaohan'),
            skillLoaderInstance.getSkillByName('rangjie'),
            skillLoaderInstance.getSkillByName('mobile_yizheng'),
        ]);
    }
}
exports.YangBiao = YangBiao;
