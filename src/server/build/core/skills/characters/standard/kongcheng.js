"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KongCheng = void 0;
const tslib_1 = require("tslib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
let KongCheng = class KongCheng extends skill_1.FilterSkill {
    canBeUsedCard(cardId, room, owner, attacker) {
        const player = room.getPlayerById(owner);
        if (player.getCardIds(0 /* HandArea */).length !== 0) {
            return true;
        }
        if (cardId instanceof card_matcher_1.CardMatcher) {
            return !new card_matcher_1.CardMatcher({ generalName: ['slash', 'duel'] }).match(cardId);
        }
        else {
            const cardName = engine_1.Sanguosha.getCardById(cardId).GeneralName;
            return cardName !== 'slash' && cardName !== 'duel';
        }
    }
};
KongCheng = tslib_1.__decorate([
    skill_1.CompulsorySkill({ name: 'kongcheng', description: 'kongcheng_description' })
], KongCheng);
exports.KongCheng = KongCheng;
