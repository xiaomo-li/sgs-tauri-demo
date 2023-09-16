"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QiZhengXiangSheng = void 0;
const tslib_1 = require("tslib");
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const skills_1 = require("core/skills");
const card_1 = require("../card");
const trick_card_1 = require("../trick_card");
let QiZhengXiangSheng = class QiZhengXiangSheng extends trick_card_1.TrickCard {
    constructor(id, cardNumber, suit) {
        super(id, cardNumber, suit, 0, 'qizhengxiangsheng', 'qizhengxiangsheng_description', "character_skills" /* CharacterSkills */, loader_skills_1.SkillLoader.getInstance().getSkillByName('qizhengxiangsheng'));
    }
    get Skill() {
        return this.skill;
    }
};
QiZhengXiangSheng = tslib_1.__decorate([
    card_1.UniqueCard({ bySkill: skills_1.TianZuo.GeneralName }),
    tslib_1.__metadata("design:paramtypes", [Number, Number, Number])
], QiZhengXiangSheng);
exports.QiZhengXiangSheng = QiZhengXiangSheng;
