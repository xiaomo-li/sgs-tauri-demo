"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TiaoXinSkillTrigger = void 0;
const ai_lib_1 = require("core/ai/ai_lib");
const active_skill_trigger_1 = require("core/ai/skills/base/active_skill_trigger");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
class TiaoXinSkillTrigger extends active_skill_trigger_1.ActiveSkillTriggerClass {
    constructor() {
        super(...arguments);
        this.skillTrigger = (room, ai, skill) => {
            if (!skill.canUse(room, ai)) {
                return;
            }
            const enemies = ai_lib_1.AiLibrary.sortEnemiesByRole(room, ai);
            const outOfRange = enemies.filter(enemy => !room.canAttack(enemy, ai));
            if (outOfRange.length > 0) {
                return {
                    fromId: ai.Id,
                    skillName: skill.Name,
                    toIds: [outOfRange[0].Id],
                };
            }
            if (ai.getCardIds(0 /* HandArea */).find(cardId => engine_1.Sanguosha.getCardById(cardId).Name === 'jink')) {
                enemies.sort((a, b) => a.getCardIds(0 /* HandArea */).length - b.getCardIds(0 /* HandArea */).length);
                return {
                    fromId: ai.Id,
                    skillName: skill.Name,
                    toIds: [enemies[0].Id],
                };
            }
        };
    }
    dynamicallyAdjustSkillUsePriority(room, ai, skill, sortedActions) {
        const highPriorityCards = ['wuzhongshengyou', 'shunshouqianyang', 'guohechaiqiao', 'zhiheng'];
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
    onAskForCardUseEvent(content, room, availableCards) {
        const { scopedTargets, toId } = content;
        const jiangwei = room.getPlayerById(scopedTargets[0]);
        const ai = room.getPlayerById(toId);
        const filteredAvailableCards = availableCards.filter(card => room.canUseCardTo(card, ai, jiangwei));
        if (filteredAvailableCards.length > 0) {
            return {
                cardId: filteredAvailableCards[0],
                toIds: scopedTargets,
                fromId: ai.Id,
            };
        }
    }
}
exports.TiaoXinSkillTrigger = TiaoXinSkillTrigger;
