"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZhenLieSkillTrigger = void 0;
const ai_lib_1 = require("core/ai/ai_lib");
const trigger_skill_trigger_1 = require("core/ai/skills/base/trigger_skill_trigger");
const engine_1 = require("core/game/engine");
class ZhenLieSkillTrigger extends trigger_skill_trigger_1.TriggerSkillTriggerClass {
    constructor() {
        super(...arguments);
        this.skillTrigger = (room, ai, skill, onEvent) => {
            if (onEvent !== undefined) {
                const hasPeachorAlcohol = ai
                    .getCardIds(0 /* HandArea */)
                    .filter(cardId => engine_1.Sanguosha.getCardById(cardId).Name === 'alcohol' || engine_1.Sanguosha.getCardById(cardId).Name === 'peach').length > 0;
                const fromFriend = ai_lib_1.AiLibrary.areTheyFriendly(ai, room.getPlayerById(onEvent.fromId), room.Info.gameMode);
                if (!fromFriend && (ai.Hp > 2 || hasPeachorAlcohol)) {
                    return {
                        fromId: ai.Id,
                        invoke: skill.Name,
                    };
                }
            }
            else {
                return undefined;
            }
        };
    }
}
exports.ZhenLieSkillTrigger = ZhenLieSkillTrigger;
