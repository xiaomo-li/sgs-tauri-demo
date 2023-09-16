"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BingLiangCunDuan = void 0;
const tslib_1 = require("tslib");
const trick_card_1 = require("core/cards/trick_card");
const loader_skills_1 = require("core/game/package_loader/loader.skills");
let BingLiangCunDuan = class BingLiangCunDuan extends trick_card_1.TrickCard {
    constructor(id, cardNumber, suit) {
        super(id, cardNumber, suit, 1, 'bingliangcunduan', 'bingliangcunduan_description', "legion_fight" /* LegionFight */, loader_skills_1.SkillLoader.getInstance().getSkillByName('bingliangcunduan'));
    }
    get Skill() {
        return this.skill;
    }
};
BingLiangCunDuan = tslib_1.__decorate([
    trick_card_1.DelayedTrick,
    tslib_1.__metadata("design:paramtypes", [Number, Number, Number])
], BingLiangCunDuan);
exports.BingLiangCunDuan = BingLiangCunDuan;
