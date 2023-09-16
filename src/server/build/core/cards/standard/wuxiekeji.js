"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WuXieKeJi = void 0;
const tslib_1 = require("tslib");
const trick_card_1 = require("core/cards/trick_card");
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const card_1 = require("../card");
let WuXieKeJi = class WuXieKeJi extends trick_card_1.TrickCard {
    constructor(id, cardNumber, suit) {
        super(id, cardNumber, suit, 0, 'wuxiekeji', 'wuxiekeji_description', "standard" /* Standard */, loader_skills_1.SkillLoader.getInstance().getSkillByName('wuxiekeji'));
    }
    get Skill() {
        return this.skill;
    }
};
WuXieKeJi = tslib_1.__decorate([
    card_1.None,
    tslib_1.__metadata("design:paramtypes", [Number, Number, Number])
], WuXieKeJi);
exports.WuXieKeJi = WuXieKeJi;
