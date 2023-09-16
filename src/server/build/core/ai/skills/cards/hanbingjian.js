"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HanBingJianSkillTrigger = void 0;
const ai_lib_1 = require("core/ai/ai_lib");
const trigger_skill_trigger_1 = require("../base/trigger_skill_trigger");
class HanBingJianSkillTrigger extends trigger_skill_trigger_1.TriggerSkillTriggerClass {
    constructor() {
        super(...arguments);
        this.skillTrigger = (room, ai, skill, onEvent, skillInCard) => {
            if (!onEvent) {
                return;
            }
            const drunkTag = ai.getInvisibleMark('drunk');
            return drunkTag
                ? undefined
                : {
                    fromId: ai.Id,
                    invoke: skill.Name,
                };
        };
        this.onAskForChoosingCardFromPlayerEvent = (content, room) => {
            const ai = room.getPlayerById(content.fromId);
            const to = room.getPlayerById(content.toId);
            const handCards = content.options[0 /* HandArea */];
            const equipCards = content.options[1 /* EquipArea */];
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
            return;
        };
    }
}
exports.HanBingJianSkillTrigger = HanBingJianSkillTrigger;
