"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlcoholSkillTrigger = void 0;
const ai_lib_1 = require("core/ai/ai_lib");
const active_skill_trigger_1 = require("core/ai/skills/base/active_skill_trigger");
const card_matcher_1 = require("core/cards/libs/card_matcher");
class AlcoholSkillTrigger extends active_skill_trigger_1.ActiveSkillTriggerClass {
    constructor() {
        super(...arguments);
        this.skillTrigger = (room, ai, skill, skillInCard) => {
            const slashMatcher = new card_matcher_1.CardMatcher({ generalName: ['slash'] });
            if (!ai.canUseCard(room, slashMatcher)) {
                return;
            }
            const enemies = ai_lib_1.AiLibrary.sortEnemiesByRole(room, ai).filter(e => ai_lib_1.AiLibrary.getAttackWillEffectSlashesTo(room, ai, e).length > 0);
            if (enemies.length === 0) {
                return;
            }
            const slashes = ai_lib_1.AiLibrary.findAvailableCardsToUse(room, ai, slashMatcher);
            if (slashes.length === 0) {
                return;
            }
            return {
                fromId: ai.Id,
                cardId: skillInCard,
            };
        };
    }
}
exports.AlcoholSkillTrigger = AlcoholSkillTrigger;
