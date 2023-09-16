"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WuZhongShengYouSkillTrigger = void 0;
const active_skill_trigger_1 = require("core/ai/skills/base/active_skill_trigger");
class WuZhongShengYouSkillTrigger extends active_skill_trigger_1.ActiveSkillTriggerClass {
    constructor() {
        super(...arguments);
        this.skillTrigger = (room, ai, skill, skillInCard) => ({
            fromId: ai.Id,
            cardId: skillInCard,
        });
    }
}
exports.WuZhongShengYouSkillTrigger = WuZhongShengYouSkillTrigger;
