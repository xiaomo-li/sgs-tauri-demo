"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaoCao = void 0;
const tslib_1 = require("tslib");
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
let CaoCao = class CaoCao extends character_1.Character {
    constructor(id) {
        super(id, 'caocao', 0 /* Male */, 0 /* Wei */, 4, 4, "standard" /* Standard */, [
            skillLoaderInstance.getSkillByName('jianxiong'),
            skillLoaderInstance.getSkillByName('hujia'),
        ]);
    }
};
CaoCao = tslib_1.__decorate([
    character_1.Lord,
    tslib_1.__metadata("design:paramtypes", [Number])
], CaoCao);
exports.CaoCao = CaoCao;
