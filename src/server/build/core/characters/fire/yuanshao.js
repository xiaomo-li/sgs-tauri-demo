"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YuanShao = void 0;
const tslib_1 = require("tslib");
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
let YuanShao = class YuanShao extends character_1.Character {
    constructor(id) {
        super(id, 'yuanshao', 0 /* Male */, 3 /* Qun */, 4, 4, "fire" /* Fire */, [
            ...skillLoaderInstance.getSkillsByName('luanji'),
            ...skillLoaderInstance.getSkillsByName('xueyi'),
        ]);
    }
};
YuanShao = tslib_1.__decorate([
    character_1.Lord,
    tslib_1.__metadata("design:paramtypes", [Number])
], YuanShao);
exports.YuanShao = YuanShao;
