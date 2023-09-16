"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlashSkillTrigger = void 0;
const ai_lib_1 = require("core/ai/ai_lib");
const active_skill_trigger_1 = require("core/ai/skills/base/active_skill_trigger");
class SlashSkillTrigger extends active_skill_trigger_1.ActiveSkillTriggerClass {
    constructor() {
        super(...arguments);
        this.skillTrigger = (room, ai, skill, skillInCard) => {
            ai.removeInvisibleMark('drunk');
            const enemies = ai_lib_1.AiLibrary.sortEnemiesByRole(room, ai).filter(e => skill.isAvailableTarget(ai.Id, room, e.Id, [], [], skillInCard) &&
                ai_lib_1.AiLibrary.getAttackWillEffectSlashesTo(room, ai, e, [skillInCard]).length > 0);
            if (enemies.length === 0) {
                return;
            }
            const targets = this.filterTargets(room, ai, skill, skillInCard, enemies);
            if (targets.length === 0) {
                return;
            }
            if (ai.hasDrunk()) {
                ai.addInvisibleMark('drunk', 1);
            }
            return {
                fromId: ai.Id,
                cardId: skillInCard,
                toIds: targets,
            };
        };
    }
    filterTargets(room, ai, skill, card, enemies) {
        const pickedEnemies = [];
        if (skill.damageType === "fire_property" /* Fire */) {
            for (const e of enemies) {
                const shield = e.getShield();
                if (shield && shield.Name === 'tengjia') {
                    if (skill.targetFilter(room, ai, [...pickedEnemies, e.Id], [], card)) {
                        pickedEnemies.push(e.Id);
                    }
                }
            }
        }
        for (const e of enemies) {
            if (pickedEnemies.includes(e.Id)) {
                continue;
            }
            if (skill.targetFilter(room, ai, [...pickedEnemies, e.Id], [], card)) {
                pickedEnemies.push(e.Id);
            }
        }
        return pickedEnemies;
    }
}
exports.SlashSkillTrigger = SlashSkillTrigger;
