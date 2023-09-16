"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeBuSiShu = void 0;
const tslib_1 = require("tslib");
const trick_card_1 = require("core/cards/trick_card");
const game_props_1 = require("core/game/game_props");
const loader_skills_1 = require("core/game/package_loader/loader.skills");
let LeBuSiShu = class LeBuSiShu extends trick_card_1.TrickCard {
    constructor(id, cardNumber, suit) {
        super(id, cardNumber, suit, game_props_1.INFINITE_DISTANCE, 'lebusishu', 'lebusishu_description', "standard" /* Standard */, loader_skills_1.SkillLoader.getInstance().getSkillByName('lebusishu'));
    }
    get Skill() {
        return this.skill;
    }
};
LeBuSiShu = tslib_1.__decorate([
    trick_card_1.DelayedTrick,
    tslib_1.__metadata("design:paramtypes", [Number, Number, Number])
], LeBuSiShu);
exports.LeBuSiShu = LeBuSiShu;
