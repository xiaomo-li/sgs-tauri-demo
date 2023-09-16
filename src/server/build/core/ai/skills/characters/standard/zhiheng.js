"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZhiHengSkillTrigger = void 0;
const ai_lib_1 = require("core/ai/ai_lib");
const active_skill_trigger_1 = require("core/ai/skills/base/active_skill_trigger");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
class ZhiHengSkillTrigger extends active_skill_trigger_1.ActiveSkillTriggerClass {
    constructor() {
        super(...arguments);
        this.skillTrigger = (room, ai, skill) => {
            if (!skill.canUse(room, ai)) {
                return;
            }
            const mustKeepCardNames = ['wuzhongshengyou', 'peach', 'guohechaiqiao', 'lebusishu'];
            const handcards = ai.getCardIds(0 /* HandArea */);
            const zhihengCards = [...handcards];
            const weaponId = ai.getEquipment(2 /* Weapon */);
            const offenseRideId = ai.getEquipment(4 /* OffenseRide */);
            const enemies = ai_lib_1.AiLibrary.sortEnemiesByRole(room, ai);
            if (enemies.find(enemy => room.distanceBetween(ai, enemy) <= 1)) {
                mustKeepCardNames.push('shunshouqianyang', 'bingliangcunduan');
                if (weaponId !== undefined) {
                    const weapon = engine_1.Sanguosha.getCardById(weaponId);
                    if (weapon.Name !== 'guanshifu' && weapon.Name !== 'qinggang') {
                        zhihengCards.push(weaponId);
                    }
                }
                if (offenseRideId !== undefined) {
                    zhihengCards.push(offenseRideId);
                }
            }
            if (enemies.filter(enemy => {
                const equip = enemy.getEquipment(3 /* Shield */);
                return equip !== undefined && engine_1.Sanguosha.getCardById(equip).Name !== 'tengjia';
            }).length >=
                enemies.length / 2) {
                mustKeepCardNames.push('nanmanruqing', 'wanjianqifa');
            }
            const shieldId = ai.getEquipment(3 /* Shield */);
            const shield = shieldId ? engine_1.Sanguosha.getCardById(shieldId) : undefined;
            if (shield && shield.Name === 'baiyinshizi') {
                zhihengCards.push(shieldId);
            }
            const availableCards = zhihengCards.filter(card => !mustKeepCardNames.includes(engine_1.Sanguosha.getCardById(card).Name));
            return {
                fromId: ai.Id,
                skillName: skill.Name,
                cardIds: availableCards,
            };
        };
    }
    dynamicallyAdjustSkillUsePriority(room, ai, skill, sortedActions) {
        const highPriorityCards = ['wuzhongshengyou', 'shunshouqianyang', 'guohechaiqiao', 'bingliangcunduan', 'lebusishu'];
        const index = sortedActions.findIndex(item => item === skill);
        let lasthighPriorityCardIndex = -1;
        for (let i = 0; i < sortedActions.length; i++) {
            const item = sortedActions[i];
            if (!(item instanceof skill_1.ActiveSkill)) {
                const card = engine_1.Sanguosha.getCardById(item);
                if (highPriorityCards.includes(card.Name)) {
                    lasthighPriorityCardIndex = i;
                }
            }
        }
        if (lasthighPriorityCardIndex >= 0) {
            const swap = skill;
            sortedActions[index] = sortedActions[lasthighPriorityCardIndex];
            sortedActions[lasthighPriorityCardIndex] = swap;
        }
        return sortedActions;
    }
}
exports.ZhiHengSkillTrigger = ZhiHengSkillTrigger;
