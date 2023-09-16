"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JieDaoShaRenSkillTrigger = void 0;
const ai_lib_1 = require("core/ai/ai_lib");
const active_skill_trigger_1 = require("core/ai/skills/base/active_skill_trigger");
const card_matcher_1 = require("core/cards/libs/card_matcher");
class JieDaoShaRenSkillTrigger extends active_skill_trigger_1.ActiveSkillTriggerClass {
    constructor() {
        super(...arguments);
        this.skillTrigger = (room, ai, skill, skillInCard) => {
            const enemies = ai_lib_1.AiLibrary.sortEnemiesByRole(room, ai).filter(e => e.getEquipment(2 /* Weapon */) !== undefined && ai.canUseCardTo(room, skillInCard, e.Id, false));
            if (enemies.length === 0) {
                return;
            }
            const targets = this.filterTargets(room, ai, skill, skillInCard, enemies);
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
    filterTargets(room, ai, skill, card, enemies) {
        if (enemies.length <= 1) {
            const jinkCards = ai_lib_1.AiLibrary.findCardsByMatcher(room, ai, new card_matcher_1.CardMatcher({ name: ['jink'] }));
            if (jinkCards.length === 0 && ai.getEquipment(3 /* Shield */) === undefined) {
                return [];
            }
            const canAttackSelf = enemies.find(e => room.canAttack(e, ai));
            if (!canAttackSelf) {
                return [];
            }
            return [canAttackSelf.Id, ai.Id];
        }
        for (const attacker of enemies) {
            const target = ai_lib_1.AiLibrary.sortEnemiesByRole(room, ai).find(e => e !== attacker && room.canAttack(attacker, e));
            if (target) {
                return [attacker.Id, target.Id];
            }
        }
        return [];
    }
}
exports.JieDaoShaRenSkillTrigger = JieDaoShaRenSkillTrigger;
