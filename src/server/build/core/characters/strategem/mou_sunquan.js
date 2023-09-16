"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MouSunQuan = void 0;
const tslib_1 = require("tslib");
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
let MouSunQuan = class MouSunQuan extends character_1.Character {
    constructor(id) {
        super(id, 'mou_sunquan', 0 /* Male */, 2 /* Wu */, 4, 4, "strategem" /* Strategem */, [
            skillLoaderInstance.getSkillByName('mou_zhiheng'),
            ...skillLoaderInstance.getSkillsByName('tongye'),
            skillLoaderInstance.getSkillByName('mou_jiuyuan'),
        ]);
    }
};
MouSunQuan = tslib_1.__decorate([
    character_1.Lord,
    tslib_1.__metadata("design:paramtypes", [Number])
], MouSunQuan);
exports.MouSunQuan = MouSunQuan;
