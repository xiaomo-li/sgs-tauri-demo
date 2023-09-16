"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiuChen = void 0;
const tslib_1 = require("tslib");
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
let LiuChen = class LiuChen extends character_1.Character {
    constructor(id) {
        super(id, 'liuchen', 0 /* Male */, 1 /* Shu */, 4, 4, "yijiang2015" /* YiJiang2015 */, [
            ...skillLoaderInstance.getSkillsByName('zhanjue'),
        ]);
    }
};
LiuChen = tslib_1.__decorate([
    character_1.Lord,
    tslib_1.__metadata("design:paramtypes", [Number])
], LiuChen);
exports.LiuChen = LiuChen;
