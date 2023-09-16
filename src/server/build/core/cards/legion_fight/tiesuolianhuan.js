"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TieSuoLianHuan = void 0;
const tslib_1 = require("tslib");
const game_props_1 = require("core/game/game_props");
const loader_skills_1 = require("core/game/package_loader/loader.skills");
const card_1 = require("../card");
const trick_card_1 = require("../trick_card");
let TieSuoLianHuan = class TieSuoLianHuan extends trick_card_1.TrickCard {
    constructor(id, cardNumber, suit) {
        super(id, cardNumber, suit, game_props_1.INFINITE_DISTANCE, 'tiesuolianhuan', 'tiesuolianhuan_description', "legion_fight" /* LegionFight */, loader_skills_1.SkillLoader.getInstance().getSkillByName('tiesuolianhuan'));
    }
    get Reforgeable() {
        return true;
    }
    get Skill() {
        return this.skill;
    }
};
TieSuoLianHuan = tslib_1.__decorate([
    card_1.Multiple,
    tslib_1.__metadata("design:paramtypes", [Number, Number, Number])
], TieSuoLianHuan);
exports.TieSuoLianHuan = TieSuoLianHuan;
