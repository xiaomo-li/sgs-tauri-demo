"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JieDaoShaRen = void 0;
const tslib_1 = require("tslib");
const trick_card_1 = require("core/cards/trick_card");
const game_props_1 = require("core/game/game_props");
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const card_1 = require("../card");
let JieDaoShaRen = class JieDaoShaRen extends trick_card_1.TrickCard {
    constructor(id, cardNumber, suit) {
        super(id, cardNumber, suit, game_props_1.INFINITE_DISTANCE, 'jiedaosharen', 'jiedaosharen_description', "standard" /* Standard */, loader_skills_1.SkillLoader.getInstance().getSkillByName('jiedaosharen'));
    }
    get Skill() {
        return this.skill;
    }
};
JieDaoShaRen = tslib_1.__decorate([
    card_1.Single,
    tslib_1.__metadata("design:paramtypes", [Number, Number, Number])
], JieDaoShaRen);
exports.JieDaoShaRen = JieDaoShaRen;
