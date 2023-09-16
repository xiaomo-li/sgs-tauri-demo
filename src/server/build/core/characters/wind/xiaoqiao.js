"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XiaoQiao = void 0;
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
class XiaoQiao extends character_1.Character {
    constructor(id) {
        super(id, 'xiaoqiao', 1 /* Female */, 2 /* Wu */, 3, 3, "wind" /* Wind */, [
            ...skillLoaderInstance.getSkillsByName('hongyan'),
            skillLoaderInstance.getSkillByName('tianxiang'),
            skillLoaderInstance.getSkillByName('piaoling'),
        ]);
    }
}
exports.XiaoQiao = XiaoQiao;
