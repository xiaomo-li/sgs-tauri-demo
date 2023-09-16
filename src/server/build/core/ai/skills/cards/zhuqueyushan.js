"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZhuQueYuShanSkillTrigger = void 0;
const trigger_skill_trigger_1 = require("../base/trigger_skill_trigger");
class ZhuQueYuShanSkillTrigger extends trigger_skill_trigger_1.TriggerSkillTriggerClass {
    constructor() {
        super(...arguments);
        this.skillTrigger = (room, ai, skill) => ({
            fromId: ai.Id,
            invoke: skill.Name,
        });
    }
}
exports.ZhuQueYuShanSkillTrigger = ZhuQueYuShanSkillTrigger;
