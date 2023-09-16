"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FireAttackSkillTrigger = void 0;
const ai_lib_1 = require("core/ai/ai_lib");
const active_skill_trigger_1 = require("core/ai/skills/base/active_skill_trigger");
const engine_1 = require("core/game/engine");
class FireAttackSkillTrigger extends active_skill_trigger_1.ActiveSkillTriggerClass {
    constructor() {
        super(...arguments);
        this.skillTrigger = (room, ai, skill, skillInCard) => {
            const otherHandCards = ai.getCardIds(0 /* HandArea */).filter(card => card !== skillInCard);
            const suits = [];
            for (const card of otherHandCards) {
                if (!suits.includes(engine_1.Sanguosha.getCardById(card).Suit)) {
                    suits.push(engine_1.Sanguosha.getCardById(card).Suit);
                }
                if (suits.length >= 4) {
                    break;
                }
            }
            if (suits.length < 3) {
                return;
            }
            const enemies = ai_lib_1.AiLibrary.sortEnemiesByRole(room, ai).filter(e => skill.isAvailableTarget(ai.Id, room, e.Id, [], [], skillInCard));
            if (enemies.length <= 0) {
                return;
            }
            const enemy = enemies.find(e => {
                const shield = e.getShield();
                return shield && shield.Name === 'tengjia';
            });
            return {
                fromId: ai.Id,
                cardId: skillInCard,
                toIds: enemy ? [enemy.Id] : [enemies[0].Id],
            };
        };
        this.onAskForCardDisplayEvent = (content, room) => {
            const ai = room.getPlayerById(content.toId);
            const handCards = ai.getCardIds(0 /* HandArea */).map(cardId => engine_1.Sanguosha.getCardById(cardId));
            let heartCard;
            let spadeCard;
            let clubCard;
            let diamondCard;
            for (const card of handCards) {
                if (card.Suit === 2 /* Heart */) {
                    heartCard = card;
                }
                else if (card.Suit === 1 /* Spade */) {
                    spadeCard = card;
                }
                else if (card.Suit === 3 /* Club */) {
                    clubCard = card;
                }
                else if (card.Suit === 4 /* Diamond */) {
                    diamondCard = card;
                }
            }
            const displayCard = heartCard || spadeCard || clubCard || diamondCard;
            if (!displayCard) {
                return;
            }
            return {
                fromId: ai.Id,
                selectedCards: [displayCard.Id],
            };
        };
    }
    filterTargets(room, ai, skill, card, enemies) {
        const pickedEnemies = [];
        const restEnemies = enemies.filter(e => {
            const shield = e.getShield();
            if (shield && shield.Name === 'tengjia') {
                if (skill.targetFilter(room, ai, [...pickedEnemies, e.Id], [], card)) {
                    pickedEnemies.push(e.Id);
                    return false;
                }
            }
            return true;
        });
        for (const e of restEnemies) {
            if (skill.targetFilter(room, ai, [...pickedEnemies, e.Id], [], card)) {
                pickedEnemies.push(e.Id);
            }
        }
        return pickedEnemies;
    }
}
exports.FireAttackSkillTrigger = FireAttackSkillTrigger;
