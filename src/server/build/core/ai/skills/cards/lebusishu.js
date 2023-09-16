"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeBuSiShuSkillTrigger = void 0;
const ai_lib_1 = require("core/ai/ai_lib");
const active_skill_trigger_1 = require("core/ai/skills/base/active_skill_trigger");
class LeBuSiShuSkillTrigger extends active_skill_trigger_1.ActiveSkillTriggerClass {
    constructor() {
        super(...arguments);
        this.skillTrigger = (room, ai, skill, skillInCard) => {
            const availableTargets = ai_lib_1.AiLibrary.sortEnemiesByRole(room, ai).filter(target => skill.isAvailableTarget(ai.Id, room, target.Id, [], [], skillInCard));
            const targets = this.filterTargets(room, ai, skill, skillInCard, availableTargets);
            if (targets.length === 0) {
                return;
            }
            return {
                fromId: ai.Id,
                cardId: skillInCard,
                toIds: targets,
            };
        };
    }
}
exports.LeBuSiShuSkillTrigger = LeBuSiShuSkillTrigger;
