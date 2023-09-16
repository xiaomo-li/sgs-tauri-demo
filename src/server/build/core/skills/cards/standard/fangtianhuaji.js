"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FangTianHuaJiSkill = void 0;
const tslib_1 = require("tslib");
const card_1 = require("core/cards/card");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
let FangTianHuaJiSkill = class FangTianHuaJiSkill extends skill_1.RulesBreakerSkill {
    breakCardUsableTargets(cardId, room, owner) {
        if (cardId instanceof card_matcher_1.CardMatcher) {
            return 0;
        }
        const handCards = owner.getCardIds(0 /* HandArea */);
        if (handCards.length !== 1) {
            return 0;
        }
        const realCards = card_1.VirtualCard.getActualCards([cardId]);
        const isSlash = realCards.length === 1 ? realCards[0] === handCards[0] : false;
        if (isSlash && engine_1.Sanguosha.getCardById(cardId).GeneralName === 'slash') {
            return 2;
        }
        return 0;
    }
};
FangTianHuaJiSkill = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'fangtianhuaji', description: 'fangtianhuaji_description' })
], FangTianHuaJiSkill);
exports.FangTianHuaJiSkill = FangTianHuaJiSkill;
