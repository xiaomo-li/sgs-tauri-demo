"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DuelSkillTrigger = void 0;
const ai_lib_1 = require("core/ai/ai_lib");
const active_skill_trigger_1 = require("core/ai/skills/base/active_skill_trigger");
const card_matcher_1 = require("core/cards/libs/card_matcher");
class DuelSkillTrigger extends active_skill_trigger_1.ActiveSkillTriggerClass {
    constructor() {
        super(...arguments);
        this.skillTrigger = (room, ai, skill, skillInCard) => {
            const slashes = ai_lib_1.AiLibrary.findAvailableCardsToResponse(room, ai, undefined, new card_matcher_1.CardMatcher({ generalName: ['slash'] }));
            const enemies = ai_lib_1.AiLibrary.sortEnemiesByRole(room, ai).filter(e => skill.isAvailableTarget(ai.Id, room, e.Id, [], [], skillInCard) &&
                (!e.hasSkill('wushuang') || e.getCardIds(0 /* HandArea */).length === 0));
            if (enemies.length === 0 || (slashes.length <= 1 && !ai.hasSkill('wushuang'))) {
                return;
            }
            const targets = this.filterTargets(room, ai, skill, skillInCard, enemies);
            if (targets.length === 0) {
                return;
            }
            return {
                fromId: ai.Id,
                cardId: skillInCard,
                toIds: targets,
            };
        };
        this.onAskForCardResponseEvent = (content, room, availableCards) => {
            if (availableCards.length === 0) {
                return;
            }
            return {
                fromId: content.toId,
                cardId: availableCards[0],
            };
        };
    }
}
exports.DuelSkillTrigger = DuelSkillTrigger;
