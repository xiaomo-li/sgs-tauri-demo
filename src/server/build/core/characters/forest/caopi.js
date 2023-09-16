"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaoPi = void 0;
const tslib_1 = require("tslib");
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const character_1 = require("../character");
const skillLoaderInstance = loader_skills_1.SkillLoader.getInstance();
let CaoPi = class CaoPi extends character_1.Character {
    constructor(id) {
        super(id, 'caopi', 0 /* Male */, 0 /* Wei */, 3, 3, "forest" /* Forest */, [
            skillLoaderInstance.getSkillByName('fangzhu'),
            skillLoaderInstance.getSkillByName('xingshang'),
            skillLoaderInstance.getSkillByName('songwei'),
        ]);
    }
};
CaoPi = tslib_1.__decorate([
    character_1.Lord,
    tslib_1.__metadata("design:paramtypes", [Number])
], CaoPi);
exports.CaoPi = CaoPi;
