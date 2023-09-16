"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WuXieKeJiSkillTrigger = void 0;
const ai_lib_1 = require("core/ai/ai_lib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const engine_1 = require("core/game/engine");
const base_trigger_1 = require("../base/base_trigger");
class WuXieKeJiSkillTrigger extends base_trigger_1.BaseSkillTrigger {
    onAskForCardUseEvent(content, room, availableCards) {
        const { scopedTargets, toId, cardUserId } = content;
        const target = (scopedTargets === null || scopedTargets === void 0 ? void 0 : scopedTargets[0]) && room.getPlayerById(scopedTargets[0]);
        const ai = room.getPlayerById(toId);
        if (target) {
            const filteredAvailableCards = availableCards.filter(card => room.canUseCardTo(card, ai, target));
            if (filteredAvailableCards.length > 0) {
                const card = content.byCardId != null && engine_1.Sanguosha.getCardById(content.byCardId);
                if (card && !ai_lib_1.AiLibrary.areTheyFriendly(ai, target, room.Info.gameMode)) {
                    return {
                        cardId: ['wugufengdeng', 'wuzhongshengyou', 'taoyuanjieyi'].includes(card.Name)
                            ? filteredAvailableCards[0]
                            : undefined,
                        fromId: ai.Id,
                    };
                }
            }
        }
        else if (cardUserId) {
            const filteredAvailableCards = availableCards.filter(card => ai.canUseCard(room, card, new card_matcher_1.CardMatcher(content.cardMatcher)));
            return {
                cardId: ai_lib_1.AiLibrary.areTheyFriendly(ai, room.getPlayerById(cardUserId), room.Info.gameMode)
                    ? undefined
                    : filteredAvailableCards.length > 0
                        ? filteredAvailableCards[0]
                        : undefined,
                fromId: ai.Id,
            };
        }
    }
}
exports.WuXieKeJiSkillTrigger = WuXieKeJiSkillTrigger;
