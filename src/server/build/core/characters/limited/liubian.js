"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiuBian = void 0;
const tslib_1 = require("tslib");
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLorderInstance = loader_skills_1.SkillLoader.getInstance();
let LiuBian = class LiuBian extends character_1.Character {
    constructor(id) {
        super(id, 'liubian', 0 /* Male */, 3 /* Qun */, 3, 3, "limited" /* Limited */, [
            ...skillLorderInstance.getSkillsByName('shiyuan'),
            ...skillLorderInstance.getSkillsByName('dushi'),
            skillLorderInstance.getSkillByName('yuwei'),
        ]);
    }
};
LiuBian = tslib_1.__decorate([
    character_1.Lord,
    tslib_1.__metadata("design:paramtypes", [Number])
], LiuBian);
exports.LiuBian = LiuBian;
