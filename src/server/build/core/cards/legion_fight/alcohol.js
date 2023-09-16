"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Alcohol = void 0;
const tslib_1 = require("tslib");
const basic_card_1 = require("core/cards/basic_card");
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const card_1 = require("../card");
let Alcohol = class Alcohol extends basic_card_1.BasicCard {
    constructor(id, cardNumber, suit) {
        super(id, cardNumber, suit, 1, 'alcohol', 'alcohol_description', "legion_fight" /* LegionFight */, loader_skills_1.SkillLoader.getInstance().getSkillByName('alcohol'));
    }
    get Skill() {
        return this.skill;
    }
};
Alcohol = tslib_1.__decorate([
    card_1.Single,
    tslib_1.__metadata("design:paramtypes", [Number, Number, Number])
], Alcohol);
exports.Alcohol = Alcohol;
