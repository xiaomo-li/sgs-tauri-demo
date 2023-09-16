"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SunHao = void 0;
const tslib_1 = require("tslib");
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLorderInstance = loader_skills_1.SkillLoader.getInstance();
let SunHao = class SunHao extends character_1.Character {
    constructor(id) {
        super(id, 'sunhao', 0 /* Male */, 2 /* Wu */, 5, 5, "sp" /* SP */, [
            ...skillLorderInstance.getSkillsByName('canshi'),
            skillLorderInstance.getSkillByName('chouhai'),
            skillLorderInstance.getSkillByName('guiming'),
        ]);
    }
};
SunHao = tslib_1.__decorate([
    character_1.Lord,
    tslib_1.__metadata("design:paramtypes", [Number])
], SunHao);
exports.SunHao = SunHao;
