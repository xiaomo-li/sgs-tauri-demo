"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NanManRuQingSkillTrigger = void 0;
const ai_lib_1 = require("core/ai/ai_lib");
const active_skill_trigger_1 = require("core/ai/skills/base/active_skill_trigger");
class NanManRuQingSkillTrigger extends active_skill_trigger_1.ActiveSkillTriggerClass {
    constructor() {
        super(...arguments);
        this.skillTrigger = (room, ai, skill, skillInCard) => {
            const enemies = ai_lib_1.AiLibrary.sortEnemiesByRole(room, ai).filter(e => room.canUseCardTo(skillInCard, ai, e) &&
                !e.hasSkill('juxiang') &&
                !(e.getEquipment(3 /* Shield */) && e.getShield().Name === 'tengjia'));
            if (enemies.length < room.AlivePlayers.length / 2) {
                return;
            }
            return {
                fromId: ai.Id,
                cardId: skillInCard,
            };
        };
    }
}
exports.NanManRuQingSkillTrigger = NanManRuQingSkillTrigger;
