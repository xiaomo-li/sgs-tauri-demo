"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MouHuaXiong = void 0;
const tslib_1 = require("tslib");
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
let MouHuaXiong = class MouHuaXiong extends character_1.Character {
    constructor(id) {
        super(id, 'mou_huaxiong', 0 /* Male */, 3 /* Qun */, 3, 4, "strategem" /* Strategem */, [
            skillLoaderInstance.getSkillByName('mou_yaowu'),
            ...skillLoaderInstance.getSkillsByName('yangwei'),
        ]);
    }
};
MouHuaXiong = tslib_1.__decorate([
    character_1.Armor(1),
    tslib_1.__metadata("design:paramtypes", [Number])
], MouHuaXiong);
exports.MouHuaXiong = MouHuaXiong;
