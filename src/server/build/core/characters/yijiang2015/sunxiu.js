"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SunXiu = void 0;
const tslib_1 = require("tslib");
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
let SunXiu = class SunXiu extends character_1.Character {
    constructor(id) {
        super(id, 'sunxiu', 0 /* Male */, 2 /* Wu */, 3, 3, "yijiang2015" /* YiJiang2015 */, [
            skillLoaderInstance.getSkillByName('yanzhu'),
            skillLoaderInstance.getSkillByName('xingxue'),
            skillLoaderInstance.getSkillByName('zhaofu'),
        ]);
    }
};
SunXiu = tslib_1.__decorate([
    character_1.Lord,
    tslib_1.__metadata("design:paramtypes", [Number])
], SunXiu);
exports.SunXiu = SunXiu;
