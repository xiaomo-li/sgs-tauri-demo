"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NanManRuQing = void 0;
const tslib_1 = require("tslib");
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const card_1 = require("../card");
const trick_card_1 = require("../trick_card");
let NanManRuQing = class NanManRuQing extends trick_card_1.TrickCard {
    constructor(id, cardNumber, suit) {
        super(id, cardNumber, suit, 0, 'nanmanruqing', 'nanmanruqing_description', "standard" /* Standard */, loader_skills_1.SkillLoader.getInstance().getSkillByName('nanmanruqing'));
    }
    get Skill() {
        return this.skill;
    }
};
NanManRuQing = tslib_1.__decorate([
    card_1.Others,
    tslib_1.__metadata("design:paramtypes", [Number, Number, Number])
], NanManRuQing);
exports.NanManRuQing = NanManRuQing;
