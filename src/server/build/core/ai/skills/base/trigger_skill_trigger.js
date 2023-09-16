"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TriggerSkillTriggerClass = void 0;
const base_trigger_1 = require("./base_trigger");
class TriggerSkillTriggerClass extends base_trigger_1.BaseSkillTrigger {
    constructor() {
        super(...arguments);
        this.skillTrigger = (room, ai, skill, onEvent, skillInCard) => undefined;
    }
}
exports.TriggerSkillTriggerClass = TriggerSkillTriggerClass;
