"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CiXiongJianSkillTrigger = void 0;
const ai_lib_1 = require("core/ai/ai_lib");
const trigger_skill_trigger_1 = require("../base/trigger_skill_trigger");
class CiXiongJianSkillTrigger extends trigger_skill_trigger_1.TriggerSkillTriggerClass {
    constructor() {
        super(...arguments);
        this.skillTrigger = (room, ai, skill) => ({
            fromId: ai.Id,
            invoke: skill.Name,
        });
    }
    onAskForChoosingOptionsEvent(content, room) {
        const ai = room.getPlayerById(content.toId);
        if (ai.getCardIds(0 /* HandArea */).length > 2) {
            return {
                fromId: content.toId,
                selectedOption: content.options[0],
            };
        }
        return {
            fromId: content.toId,
            selectedOption: content.options[1],
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
}
exports.CiXiongJianSkillTrigger = CiXiongJianSkillTrigger;
