"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QingLongDaoSkillTrigger = void 0;
const ai_lib_1 = require("core/ai/ai_lib");
const trigger_skill_trigger_1 = require("core/ai/skills/base/trigger_skill_trigger");
class QingLongDaoSkillTrigger extends trigger_skill_trigger_1.TriggerSkillTriggerClass {
    constructor() {
        super(...arguments);
        this.skillTrigger = (room, ai, skill, onEvent, skillInCard) => {
            const { toIds } = onEvent;
            const to = room.getPlayerById(toIds[0]);
            const slashes = ai_lib_1.AiLibrary.getAttackWillEffectSlashesTo(room, ai, to);
            if (slashes.length === 0) {
                return;
            }
            return {
                fromId: ai.Id,
                invoke: skill.Name,
            };
        };
        this.onAskForCardUseEvent = (content, room, availableCards) => {
            const ai = room.getPlayerById(content.toId);
            const to = room.getPlayerById(content.scopedTargets[0]);
            const slashes = ai_lib_1.AiLibrary.getAttackWillEffectSlashesTo(room, ai, to, availableCards);
            if (slashes.length > 0) {
                return {
                    fromId: content.toId,
                    toIds: content.scopedTargets,
                    cardId: slashes[0],
                };
            }
        };
    }
}
exports.QingLongDaoSkillTrigger = QingLongDaoSkillTrigger;
