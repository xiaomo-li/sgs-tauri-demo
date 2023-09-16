"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaoYuanJieYi = void 0;
const tslib_1 = require("tslib");
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const card_1 = require("../card");
const trick_card_1 = require("../trick_card");
let TaoYuanJieYi = class TaoYuanJieYi extends trick_card_1.TrickCard {
    constructor(id, cardNumber, suit) {
        super(id, cardNumber, suit, 0, 'taoyuanjieyi', 'taoyuanjieyi_description', "standard" /* Standard */, loader_skills_1.SkillLoader.getInstance().getSkillByName('taoyuanjieyi'));
    }
    get Skill() {
        return this.skill;
    }
};
TaoYuanJieYi = tslib_1.__decorate([
    card_1.Globe,
    tslib_1.__metadata("design:paramtypes", [Number, Number, Number])
], TaoYuanJieYi);
exports.TaoYuanJieYi = TaoYuanJieYi;
