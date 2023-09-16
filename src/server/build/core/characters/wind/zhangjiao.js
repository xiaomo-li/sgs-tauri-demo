"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZhangJiao = void 0;
const tslib_1 = require("tslib");
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
let ZhangJiao = class ZhangJiao extends character_1.Character {
    constructor(id) {
        super(id, 'zhangjiao', 0 /* Male */, 3 /* Qun */, 3, 3, "wind" /* Wind */, [
            skillLoaderInstance.getSkillByName('guidao'),
            ...skillLoaderInstance.getSkillsByName('leiji'),
            skillLoaderInstance.getSkillByName('huangtian'),
        ]);
    }
};
ZhangJiao = tslib_1.__decorate([
    character_1.Lord,
    tslib_1.__metadata("design:paramtypes", [Number])
], ZhangJiao);
exports.ZhangJiao = ZhangJiao;
