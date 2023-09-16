"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JieYueSkillTrigger = void 0;
const ai_lib_1 = require("core/ai/ai_lib");
const trigger_skill_trigger_1 = require("core/ai/skills/base/trigger_skill_trigger");
class JieYueSkillTrigger extends trigger_skill_trigger_1.TriggerSkillTriggerClass {
    constructor() {
        super(...arguments);
        this.skillTrigger = (room, ai, skill) => {
            const cards = ai.getPlayerCards();
            if (cards.length <= 2) {
                return {
                    fromId: ai.Id,
                };
            }
            const enemies = ai_lib_1.AiLibrary.sortEnemiesByRole(room, ai);
            return {
                fromId: ai.Id,
                invoke: skill.Name,
                toIds: [enemies[0].Id],
                cardIds: [ai_lib_1.AiLibrary.sortCardbyValue(cards, true)[0]],
            };
        };
    }
    onAskForChoosingOptionsEvent(content, room) {
        const ai = room.getPlayerById(content.toId);
        if (ai.getCardIds(0 /* HandArea */).length >= 4 || ai.getCardIds(1 /* EquipArea */).length >= 3) {
            return {
                fromId: content.toId,
                selectedOption: content.options[1],
            };
        }
        return {
            fromId: content.toId,
            selectedOption: content.options[0],
        };
    }
    onAskForCardDropEvent(content, room) {
        const ai = room.getPlayerById(content.toId);
        const handcards = ai_lib_1.AiLibrary.sortCardbyValue(ai.getCardIds(0 /* HandArea */), false);
        return {
            fromId: ai.Id,
            droppedCards: [handcards[0]],
        };
    }
    onAskForChoosingCardWithConditionsEvent(content, room) {
        const { customCardFields } = content;
        const handcards = customCardFields[0 /* HandArea */];
        const equips = customCardFields[1 /* EquipArea */];
        const cards = [];
        if (handcards) {
            cards.push(ai_lib_1.AiLibrary.sortCardbyValue(handcards)[0]);
        }
        if (equips) {
            cards.push(ai_lib_1.AiLibrary.sortCardbyValue(equips)[0]);
        }
        return {
            fromId: content.toId,
            selectedCards: cards,
        };
    }
}
exports.JieYueSkillTrigger = JieYueSkillTrigger;
