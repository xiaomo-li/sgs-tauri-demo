"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Slash = void 0;
const tslib_1 = require("tslib");
const basic_card_1 = require("core/cards/basic_card");
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const card_1 = require("../card");
let Slash = class Slash extends basic_card_1.BasicCard {
    constructor(id, cardNumber, suit) {
        super(id, cardNumber, suit, 1, 'slash', 'slash_description', "standard" /* Standard */, loader_skills_1.SkillLoader.getInstance().getSkillByName('slash'));
    }
    get Skill() {
        return this.skill;
    }
};
Slash = tslib_1.__decorate([
    card_1.Multiple,
    tslib_1.__metadata("design:paramtypes", [Number, Number, Number])
], Slash);
exports.Slash = Slash;
