"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActiveSkillTriggerClass = void 0;
const base_trigger_1 = require("./base_trigger");
class ActiveSkillTriggerClass extends base_trigger_1.BaseSkillTrigger {
    constructor() {
        super(...arguments);
        this.skillTrigger = (room, ai, skill, card) => undefined;
    }
    filterTargets(room, ai, skill, card, targets) {
        const pickedTargets = [];
        for (const target of targets) {
            if (skill.targetFilter(room, ai, [...pickedTargets, target.Id], [], card)) {
                pickedTargets.push(target.Id);
            }
        }
        return pickedTargets;
    }
    reforgeTrigger(room, ai, skill, card) {
        return false;
    }
    dynamicallyAdjustSkillUsePriority(room, ai, skill, sortedActions) {
        return sortedActions;
    }
}
exports.ActiveSkillTriggerClass = ActiveSkillTriggerClass;
