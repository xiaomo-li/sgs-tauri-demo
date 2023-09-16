"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShangShiSkillTrigger = void 0;
const trigger_skill_trigger_1 = require("core/ai/skills/base/trigger_skill_trigger");
class ShangShiSkillTrigger extends trigger_skill_trigger_1.TriggerSkillTriggerClass {
    constructor() {
        super(...arguments);
        this.skillTrigger = (room, ai, skill) => ({
            fromId: ai.Id,
            invoke: skill.Name,
        });
    }
}
exports.ShangShiSkillTrigger = ShangShiSkillTrigger;
