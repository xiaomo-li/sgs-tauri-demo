"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiuShan = void 0;
const tslib_1 = require("tslib");
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
let LiuShan = class LiuShan extends character_1.Character {
    constructor(id) {
        super(id, 'liushan', 0 /* Male */, 1 /* Shu */, 3, 3, "mountain" /* Mountain */, [
            skillLoaderInstance.getSkillByName('xiangle'),
            ...skillLoaderInstance.getSkillsByName('fangquan'),
            skillLoaderInstance.getSkillByName('ruoyu'),
        ]);
    }
};
LiuShan = tslib_1.__decorate([
    character_1.Lord,
    tslib_1.__metadata("design:paramtypes", [Number])
], LiuShan);
exports.LiuShan = LiuShan;
