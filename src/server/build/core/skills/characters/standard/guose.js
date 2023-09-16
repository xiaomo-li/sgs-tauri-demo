"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuoSe = void 0;
const tslib_1 = require("tslib");
const card_1 = require("core/cards/card");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
let GuoSe = class GuoSe extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return !owner.hasUsedSkill(this.Name);
    }
    isRefreshAt(room, owner, phase) {
        return phase === 4 /* PlayCardStage */;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, target, selectedCards, selectedTargets, containerCard) {
        const guoseCard = selectedCards.length > 0 ? engine_1.Sanguosha.getCardById(selectedCards[0]) : undefined;
        const matcherProps = { name: ['lebusishu'] };
        if (guoseCard) {
            matcherProps.suit = [guoseCard.Suit];
        }
        return target !== owner && room.getPlayerById(owner).canUseCardTo(room, new card_matcher_1.CardMatcher(matcherProps), target);
    }
    isAvailableCard(owner, room, cardId, selectedCards, selectedTargets, containerCard) {
        const card = engine_1.Sanguosha.getCardById(cardId);
        return card.Suit === 4 /* Diamond */;
    }
    async onUse(room, event) {
        return true;
    }
    async onEffect(room, event) {
        const { toIds, cardIds, fromId } = event;
        const hasLeBuSiShu = room
            .getPlayerById(toIds[0])
            .getCardIds(2 /* JudgeArea */)
            .find(cardId => engine_1.Sanguosha.getCardById(cardId).GeneralName === 'lebusishu');
        if (hasLeBuSiShu) {
            await room.dropCards(4 /* SelfDrop */, cardIds, fromId, fromId, this.Name);
            await room.dropCards(5 /* PassiveDrop */, [hasLeBuSiShu], toIds[0], fromId, this.Name);
        }
        else {
            const realCard = engine_1.Sanguosha.getCardById(cardIds[0]);
            const lebusishuCard = card_1.VirtualCard.create({
                cardName: 'lebusishu',
                cardNumber: realCard.CardNumber,
                cardSuit: realCard.Suit,
                bySkill: this.Name,
            }, cardIds);
            await room.useCard({
                fromId,
                targetGroup: toIds && [toIds],
                cardId: lebusishuCard.Id,
                triggeredBySkills: [this.Name],
            });
        }
        await room.drawCards(1, fromId, 'top', undefined, this.Name);
        return true;
    }
};
GuoSe = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'guose', description: 'guose_description' })
], GuoSe);
exports.GuoSe = GuoSe;
