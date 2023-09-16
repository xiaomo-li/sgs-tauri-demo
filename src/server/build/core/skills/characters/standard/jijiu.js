"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JiJiu = void 0;
const tslib_1 = require("tslib");
const card_1 = require("core/cards/card");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
let JiJiu = class JiJiu extends skill_1.ViewAsSkill {
    canViewAs() {
        return ['peach'];
    }
    canUse(room, owner) {
        return room.CurrentPlayer !== owner;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    isAvailableCard(room, owner, pendingCardId) {
        return engine_1.Sanguosha.getCardById(pendingCardId).isRed();
    }
    viewAs(selectedCards) {
        return card_1.VirtualCard.create({
            cardName: 'peach',
            bySkill: this.Name,
        }, selectedCards);
    }
};
JiJiu = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'jijiu', description: 'jijiu_description' })
], JiJiu);
exports.JiJiu = JiJiu;
