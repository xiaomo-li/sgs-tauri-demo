"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiuBei = void 0;
const tslib_1 = require("tslib");
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
let LiuBei = class LiuBei extends character_1.Character {
    constructor(id) {
        super(id, 'liubei', 0 /* Male */, 1 /* Shu */, 4, 4, "standard" /* Standard */, [
            ...skillLoaderInstance.getSkillsByName('rende'),
            ...skillLoaderInstance.getSkillsByName('jijiang'),
        ]);
    }
};
LiuBei = tslib_1.__decorate([
    character_1.Lord,
    tslib_1.__metadata("design:paramtypes", [Number])
], LiuBei);
exports.LiuBei = LiuBei;
