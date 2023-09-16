"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeiGeSkillTrigger = void 0;
const ai_lib_1 = require("core/ai/ai_lib");
const trigger_skill_trigger_1 = require("core/ai/skills/base/trigger_skill_trigger");
class BeiGeSkillTrigger extends trigger_skill_trigger_1.TriggerSkillTriggerClass {
    constructor() {
        super(...arguments);
        this.skillTrigger = (room, ai, skill, onEvent) => {
            const cards = ai.getCardIds().filter(card => room.canDropCard(ai.Id, card));
            if (cards.length > 0 && onEvent !== undefined && onEvent.fromId) {
                if (!ai_lib_1.AiLibrary.areTheyFriendly(ai, room.getPlayerById(onEvent.fromId), room.Info.gameMode)) {
                    return {
                        fromId: ai.Id,
                        invoke: skill.Name,
                        cardIds: ai_lib_1.AiLibrary.sortCardbyValue(cards, false).slice(0, 1),
                    };
                }
            }
        };
    }
}
exports.BeiGeSkillTrigger = BeiGeSkillTrigger;
