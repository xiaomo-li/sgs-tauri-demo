"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeiMu = void 0;
const tslib_1 = require("tslib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
let WeiMu = class WeiMu extends skill_1.FilterSkill {
    get RelatedCharacters() {
        return ['wangyuanji'];
    }
    audioIndex(characterName) {
        return characterName && this.RelatedCharacters.includes(characterName) ? 1 : 2;
    }
    canBeUsedCard(cardId, room, owner, attacker) {
        if (cardId instanceof card_matcher_1.CardMatcher) {
            return !new card_matcher_1.CardMatcher({ suit: [1 /* Spade */, 3 /* Club */], type: [7 /* Trick */] }).match(cardId);
        }
        else {
            const card = engine_1.Sanguosha.getCardById(cardId);
            return !(card.is(7 /* Trick */) && card.isBlack());
        }
    }
};
WeiMu = tslib_1.__decorate([
    skill_1.CompulsorySkill({ name: 'weimu', description: 'weimu_description' })
], WeiMu);
exports.WeiMu = WeiMu;
