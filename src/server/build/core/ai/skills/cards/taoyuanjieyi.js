"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaoYuanJieYiSkillTrigger = void 0;
const ai_lib_1 = require("core/ai/ai_lib");
const active_skill_trigger_1 = require("core/ai/skills/base/active_skill_trigger");
class TaoYuanJieYiSkillTrigger extends active_skill_trigger_1.ActiveSkillTriggerClass {
    constructor() {
        super(...arguments);
        this.skillTrigger = (room, ai, skill, skillInCard) => {
            const friends = ai_lib_1.AiLibrary.sortFriendsFromWeakToStrong(room, ai).filter(f => room.canUseCardTo(skillInCard, ai, f) && f.isInjured());
            const enemies = ai_lib_1.AiLibrary.sortEnemiesByRole(room, ai).filter(e => room.canUseCardTo(skillInCard, ai, e) && e.isInjured());
            const extra = ai.isInjured() ? 1 : 0;
            if (friends.length + extra < enemies.length) {
                return;
            }
            return {
                fromId: ai.Id,
                cardId: skillInCard,
            };
        };
    }
}
exports.TaoYuanJieYiSkillTrigger = TaoYuanJieYiSkillTrigger;
