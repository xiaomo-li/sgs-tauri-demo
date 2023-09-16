"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TieSuoLianHuanSkillTrigger = void 0;
const ai_lib_1 = require("core/ai/ai_lib");
const active_skill_trigger_1 = require("core/ai/skills/base/active_skill_trigger");
class TieSuoLianHuanSkillTrigger extends active_skill_trigger_1.ActiveSkillTriggerClass {
    constructor() {
        super(...arguments);
        this.skillTrigger = (room, ai, skill, skillInCard) => {
            const enemies = ai_lib_1.AiLibrary.sortEnemiesByRole(room, ai).filter(e => room.canUseCardTo(skillInCard, ai, e) && !e.ChainLocked);
            const targets = this.filterTargets(room, ai, skill, skillInCard, enemies);
            if (targets.length <= 1) {
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
        const filteredTargets = [];
        if (ai.ChainLocked) {
            const tengjiaEnemies = enemies.filter(e => e.getEquipment(3 /* Shield */) && e.getShield().Name === 'tengjia');
            if (tengjiaEnemies.length > 0 && ai.getCardIds(0 /* HandArea */).length >= 2) {
                for (const e of tengjiaEnemies) {
                    if (skill.targetFilter(room, ai, [...filteredTargets, e.Id], [], card)) {
                        filteredTargets.push(e.Id);
                    }
                }
                if (filteredTargets.length > 0) {
                    return filteredTargets;
                }
            }
            else {
                filteredTargets.push(ai.Id);
            }
        }
        for (const e of enemies) {
            if (skill.targetFilter(room, ai, [...filteredTargets, e.Id], [], card)) {
                filteredTargets.push(e.Id);
            }
        }
        return filteredTargets;
    }
    reforgeTrigger(room, ai, skill, card) {
        if (ai.ChainLocked) {
            return false;
        }
        const enemies = ai_lib_1.AiLibrary.sortEnemiesByRole(room, ai).filter(e => room.canUseCardTo(card, ai, e) && !e.ChainLocked);
        if (enemies.length < 2) {
            if (enemies.filter(e => e.getEquipment(3 /* Shield */) && e.getShield().Name === 'tengjia').length > 0 &&
                ai.getCardIds(0 /* HandArea */).length >= 2) {
                return false;
            }
        }
        else {
            return false;
        }
        return true;
    }
}
exports.TieSuoLianHuanSkillTrigger = TieSuoLianHuanSkillTrigger;
