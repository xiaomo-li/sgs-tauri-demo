"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeiGe = void 0;
const tslib_1 = require("tslib");
const beige_1 = require("core/ai/skills/characters/mountain/beige");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
let BeiGe = class BeiGe extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterDamagedEffect" /* AfterDamagedEffect */;
    }
    canUse(room, owner, content) {
        const { cardIds } = content;
        if (cardIds === undefined) {
            return false;
        }
        const card = engine_1.Sanguosha.getCardById(cardIds[0]);
        return (card.GeneralName === 'slash' &&
            content.fromId !== undefined &&
            !room.getPlayerById(content.toId).Dead &&
            !content.isFromChainedDamage);
    }
    isAvailableCard(owner, room, cardId) {
        return room.canDropCard(owner, cardId);
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const { triggeredOnEvent } = skillUseEvent;
        await room.dropCards(4 /* SelfDrop */, skillUseEvent.cardIds, skillUseEvent.fromId, skillUseEvent.fromId, this.Name);
        const { toId, fromId } = triggeredOnEvent;
        const judge = await room.judge(toId, undefined, this.Name);
        const judgeCard = engine_1.Sanguosha.getCardById(judge.judgeCardId);
        const damageFrom = room.getPlayerById(fromId);
        if (judgeCard.Suit === 3 /* Club */) {
            const numOfCards = damageFrom.getPlayerCards().length;
            if (!damageFrom.Dead && numOfCards > 0) {
                const numOfDiscard = Math.min(numOfCards, 2);
                const response = await room.askForCardDrop(fromId, numOfDiscard, [0 /* HandArea */, 1 /* EquipArea */], true, undefined, this.Name);
                response.droppedCards.length > 0 &&
                    (await room.dropCards(4 /* SelfDrop */, response.droppedCards, fromId));
            }
        }
        else if (judgeCard.Suit === 1 /* Spade */) {
            if (!damageFrom.Dead) {
                await room.turnOver(fromId);
            }
        }
        else if (judgeCard.Suit === 2 /* Heart */) {
            const damageEvent = triggeredOnEvent;
            await room.recover({
                recoveredHp: damageEvent.damage,
                recoverBy: toId,
                toId: toId,
                triggeredBySkills: [this.Name],
            });
        }
        else if (judgeCard.Suit === 4 /* Diamond */) {
            await room.drawCards(3, toId, 'top', undefined, this.Name);
        }
        return true;
    }
};
BeiGe = tslib_1.__decorate([
    skill_1.AI(beige_1.BeiGeSkillTrigger),
    skill_1.CommonSkill({ name: 'beige', description: 'beige_description' })
], BeiGe);
exports.BeiGe = BeiGe;
