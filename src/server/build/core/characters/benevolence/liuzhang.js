"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiuZhang = void 0;
const tslib_1 = require("tslib");
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
let LiuZhang = class LiuZhang extends character_1.Character {
    constructor(id) {
        super(id, 'liuzhang', 0 /* Male */, 3 /* Qun */, 3, 3, "benevolence" /* Benevolence */, [
            skillLoaderInstance.getSkillByName('jutu'),
            ...skillLoaderInstance.getSkillsByName('yaohu'),
            skillLoaderInstance.getSkillByName('huaibi'),
        ]);
    }
};
LiuZhang = tslib_1.__decorate([
    character_1.Lord,
    tslib_1.__metadata("design:paramtypes", [Number])
], LiuZhang);
exports.LiuZhang = LiuZhang;
