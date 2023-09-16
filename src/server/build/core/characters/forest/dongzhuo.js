"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DongZhuo = void 0;
const tslib_1 = require("tslib");
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
let DongZhuo = class DongZhuo extends character_1.Character {
    constructor(id) {
        super(id, 'dongzhuo', 0 /* Male */, 3 /* Qun */, 8, 8, "forest" /* Forest */, [
            ...skillLoaderInstance.getSkillsByName('jiuchi'),
            ...skillLoaderInstance.getSkillsByName('roulin'),
            skillLoaderInstance.getSkillByName('benghuai'),
            skillLoaderInstance.getSkillByName('baonve'),
        ]);
    }
};
DongZhuo = tslib_1.__decorate([
    character_1.Lord,
    tslib_1.__metadata("design:paramtypes", [Number])
], DongZhuo);
exports.DongZhuo = DongZhuo;
