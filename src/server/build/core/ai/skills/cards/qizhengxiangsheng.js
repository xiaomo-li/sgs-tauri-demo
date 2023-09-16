"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QiZhengXiangShengSkillTrigger = void 0;
const ai_lib_1 = require("core/ai/ai_lib");
const active_skill_trigger_1 = require("core/ai/skills/base/active_skill_trigger");
class QiZhengXiangShengSkillTrigger extends active_skill_trigger_1.ActiveSkillTriggerClass {
    constructor() {
        super(...arguments);
        this.skillTrigger = (room, ai, skill, skillInCard) => {
            const enemies = ai_lib_1.AiLibrary.sortEnemiesByRole(room, ai)
                .filter(e => room.canUseCardTo(skillInCard, ai, e))
                .sort((a, b) => {
                if (a.getCardIds(0 /* HandArea */).length < b.getCardIds(0 /* HandArea */).length) {
                    return -1;
                }
                else if (a.getCardIds(0 /* HandArea */).length === b.getCardIds(0 /* HandArea */).length) {
                    return 0;
                }
                return 1;
            });
            if (enemies.length === 0) {
                return;
            }
            return {
                fromId: ai.Id,
                toIds: [enemies[0].Id],
                cardId: skillInCard,
            };
        };
    }
    onAskForChoosingOptionsEvent(content, room) {
        const randomSelect = Math.random() > 0.6;
        return {
            fromId: content.toId,
            selectedOption: content.options[randomSelect ? 1 : 0],
        };
    }
}
exports.QiZhengXiangShengSkillTrigger = QiZhengXiangShengSkillTrigger;
