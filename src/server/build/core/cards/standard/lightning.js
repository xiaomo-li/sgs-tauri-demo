"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lightning = void 0;
const tslib_1 = require("tslib");
const trick_card_1 = require("core/cards/trick_card");
const loader_skills_1 = require("core/game/package_loader/loader.skills");
let Lightning = class Lightning extends trick_card_1.TrickCard {
    constructor(id, cardNumber, suit) {
        super(id, cardNumber, suit, 0, 'lightning', 'lightning_description', "standard" /* Standard */, loader_skills_1.SkillLoader.getInstance().getSkillByName('lightning'));
    }
    get Skill() {
        return this.skill;
    }
};
Lightning = tslib_1.__decorate([
    trick_card_1.DelayedTrick,
    tslib_1.__metadata("design:paramtypes", [Number, Number, Number])
], Lightning);
exports.Lightning = Lightning;
