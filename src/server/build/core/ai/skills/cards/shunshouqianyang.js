"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShunShouQianYangSkillTrigger = void 0;
const ai_lib_1 = require("core/ai/ai_lib");
const active_skill_trigger_1 = require("core/ai/skills/base/active_skill_trigger");
class ShunShouQianYangSkillTrigger extends active_skill_trigger_1.ActiveSkillTriggerClass {
    constructor() {
        super(...arguments);
        this.skillTrigger = (room, ai, skill, skillInCard) => {
            const friends = ai_lib_1.AiLibrary.sortFriendsFromWeakToStrong(room, ai).filter(f => f.getCardIds(2 /* JudgeArea */).length > 0);
            const enemies = ai_lib_1.AiLibrary.sortEnemiesByRole(room, ai);
            const availableTargets = [...friends, ...enemies].filter(target => target.getPlayerCards().length > 0 && skill.isAvailableTarget(ai.Id, room, target.Id, [], [], skillInCard));
            const targets = this.filterTargets(room, ai, skill, skillInCard, availableTargets);
            if (targets.length === 0) {
                return;
            }
            return {
                fromId: ai.Id,
                cardId: skillInCard,
                toIds: targets,
            };
        };
        this.onAskForChoosingCardFromPlayerEvent = (content, room) => {
            const ai = room.getPlayerById(content.fromId);
            const to = room.getPlayerById(content.toId);
            const judgeCards = content.options[2 /* JudgeArea */];
            const handCards = content.options[0 /* HandArea */];
            const equipCards = content.options[1 /* EquipArea */];
            if (ai_lib_1.AiLibrary.areTheyFriendly(ai, to, room.Info.gameMode)) {
                if (judgeCards) {
                    const availablecard = ai_lib_1.AiLibrary.sortByJudgeCardsThreatenValue(judgeCards)[0];
                    return {
                        fromId: ai.Id,
                        selectedCard: availablecard,
                        fromArea: 2 /* JudgeArea */,
                    };
                }
                if (handCards !== undefined) {
                    const index = Math.floor(Math.random() * handCards);
                    return {
                        fromId: ai.Id,
                        selectedCardIndex: index,
                        fromArea: 0 /* HandArea */,
                    };
                }
                if (equipCards && equipCards.length > 0) {
                    return {
                        fromId: ai.Id,
                        selectedCard: equipCards[equipCards.length - 1],
                        fromArea: 1 /* EquipArea */,
                    };
                }
            }
            else {
                if (equipCards && equipCards.length > 0) {
                    return {
                        fromId: ai.Id,
                        selectedCard: ai_lib_1.AiLibrary.sortTargetEquipsInDefense(room, ai, to)[0],
                        fromArea: 1 /* EquipArea */,
                    };
                }
                if (handCards !== undefined) {
                    const index = Math.floor(Math.random() * handCards);
                    return {
                        fromId: ai.Id,
                        selectedCardIndex: index,
                        fromArea: 0 /* HandArea */,
                    };
                }
                if (judgeCards) {
                    const availablecards = ai_lib_1.AiLibrary.sortByJudgeCardsThreatenValue(judgeCards);
                    return {
                        fromId: ai.Id,
                        selectedCard: availablecards[availablecards.length - 1],
                        fromArea: 2 /* JudgeArea */,
                    };
                }
            }
            return;
        };
    }
}
exports.ShunShouQianYangSkillTrigger = ShunShouQianYangSkillTrigger;
