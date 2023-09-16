"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaoRui = void 0;
const tslib_1 = require("tslib");
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
let CaoRui = class CaoRui extends character_1.Character {
    constructor(id) {
        super(id, 'caorui', 0 /* Male */, 0 /* Wei */, 3, 3, "yijiang2015" /* YiJiang2015 */, [
            skillLoaderInstance.getSkillByName('huituo'),
            skillLoaderInstance.getSkillByName('mingjian'),
            ...skillLoaderInstance.getSkillsByName('xingshuai'),
        ]);
    }
};
CaoRui = tslib_1.__decorate([
    character_1.Lord,
    tslib_1.__metadata("design:paramtypes", [Number])
], CaoRui);
exports.CaoRui = CaoRui;
