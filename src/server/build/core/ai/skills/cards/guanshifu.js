"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuanShiFuSkillTrigger = void 0;
const ai_lib_1 = require("core/ai/ai_lib");
const trigger_skill_trigger_1 = require("../base/trigger_skill_trigger");
class GuanShiFuSkillTrigger extends trigger_skill_trigger_1.TriggerSkillTriggerClass {
    constructor() {
        super(...arguments);
        this.skillTrigger = (room, ai, skill, onEvent, skillInCard) => {
            const cards = ai.getCardIds().filter(card => card !== skillInCard);
            let shouldUse = false;
            if (cards.length < 2) {
                return;
            }
            if (cards.length <= 4) {
                const inDangerEnemy = onEvent.toIds.find(toId => room.getPlayerById(toId).Hp <= 2);
                if (inDangerEnemy) {
                    shouldUse = true;
                }
            }
            else {
                shouldUse = true;
            }
            if (!shouldUse) {
                return;
            }
            return {
                fromId: ai.Id,
                invoke: skill.Name,
                cardIds: ai_lib_1.AiLibrary.sortCardbyValue(cards, false).slice(0, 2),
            };
        };
    }
}
exports.GuanShiFuSkillTrigger = GuanShiFuSkillTrigger;
