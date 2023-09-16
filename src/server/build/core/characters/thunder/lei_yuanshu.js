"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeiYuanShu = void 0;
const tslib_1 = require("tslib");
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
let LeiYuanShu = class LeiYuanShu extends character_1.Character {
    constructor(id) {
        super(id, 'lei_yuanshu', 0 /* Male */, 3 /* Qun */, 4, 4, "thunder" /* Thunder */, [
            ...skillLoaderInstance.getSkillsByName('lei_yongsi'),
            skillLoaderInstance.getSkillByName('lei_weidi'),
        ]);
    }
};
LeiYuanShu = tslib_1.__decorate([
    character_1.Lord,
    tslib_1.__metadata("design:paramtypes", [Number])
], LeiYuanShu);
exports.LeiYuanShu = LeiYuanShu;
