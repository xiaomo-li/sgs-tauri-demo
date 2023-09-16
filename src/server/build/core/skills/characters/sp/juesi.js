"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JueSi = void 0;
const tslib_1 = require("tslib");
const card_1 = require("core/cards/card");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let JueSi = class JueSi extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return owner.getPlayerCards().length > 0;
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, target) {
        return (room.withinAttackDistance(room.getPlayerById(owner), room.getPlayerById(target)) &&
            room.getPlayerById(target).getPlayerCards().length > 0);
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    isAvailableCard(owner, room, cardId) {
        return engine_1.Sanguosha.getCardById(cardId).GeneralName === 'slash';
    }
    async onUse() {
        return true;
    }
    async onEffect(room, event) {
        if (!event.toIds || !event.cardIds) {
            return false;
        }
        await room.dropCards(4 /* SelfDrop */, event.cardIds, event.fromId, event.fromId, this.Name);
        const response = await room.askForCardDrop(event.toIds[0], 1, [0 /* HandArea */, 1 /* EquipArea */], true, undefined, this.Name);
        if (response.droppedCards.length > 0) {
            await room.dropCards(4 /* SelfDrop */, response.droppedCards, event.toIds[0], event.toIds[0], this.Name);
            const virtualDuel = card_1.VirtualCard.create({ cardName: 'duel', bySkill: this.Name }).Id;
            engine_1.Sanguosha.getCardById(response.droppedCards[0]).GeneralName !== 'slash' &&
                room.getPlayerById(event.toIds[0]).Hp >= room.getPlayerById(event.fromId).Hp &&
                room.getPlayerById(event.fromId).canUseCardTo(room, virtualDuel, event.toIds[0]) &&
                (await room.useCard({
                    fromId: event.fromId,
                    targetGroup: [event.toIds],
                    cardId: virtualDuel,
                }));
        }
        return true;
    }
};
JueSi = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'juesi', description: 'juesi_description' })
], JueSi);
exports.JueSi = JueSi;
