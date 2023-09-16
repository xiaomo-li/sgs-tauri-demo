"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JieYin = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
let JieYin = class JieYin extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return !owner.hasUsedSkill(this.Name);
    }
    isRefreshAt(room, owner, phase) {
        return phase === 4 /* PlayCardStage */;
    }
    numberOfTargets() {
        return 1;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    isAvailableTarget(owner, room, target, selectedCards) {
        const targetPlayer = room.getPlayerById(target);
        if (targetPlayer.Gender !== 0 /* Male */) {
            return false;
        }
        if (selectedCards.length === 0) {
            return false;
        }
        const card = engine_1.Sanguosha.getCardById(selectedCards[0]);
        const fromArea = room.getPlayerById(owner).cardFrom(card.Id);
        if (card.is(1 /* Equip */) && fromArea === 1 /* EquipArea */) {
            const sameTypeEquip = targetPlayer
                .getCardIds(1 /* EquipArea */)
                .find(equip => engine_1.Sanguosha.getCardById(equip).isSameType(card)) !== undefined;
            if (sameTypeEquip) {
                return false;
            }
        }
        return true;
    }
    isAvailableCard(owner, room, cardId) {
        const fromArea = room.getPlayerById(owner).cardFrom(cardId);
        return !(fromArea === 0 /* HandArea */ && !room.canDropCard(owner, cardId));
    }
    async onUse(room, event) {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const { toIds, cardIds, fromId } = skillUseEvent;
        const card = engine_1.Sanguosha.getCardById(cardIds[0]);
        const to = room.getPlayerById(toIds[0]);
        const from = room.getPlayerById(fromId);
        if (card.is(1 /* Equip */) &&
            to.getCardIds(1 /* EquipArea */).find(equip => engine_1.Sanguosha.getCardById(equip).isSameType(card)) ===
                undefined) {
            const fromArea = from.cardFrom(card.Id);
            let moveCard = true;
            if (fromArea === 0 /* HandArea */) {
                const askForChoose = {
                    toId: fromId,
                    options: ['jieyin:drop', 'jieyin:move'],
                    conversation: 'please choose',
                    triggeredBySkills: [this.Name],
                };
                room.notify(168 /* AskForChoosingOptionsEvent */, event_packer_1.EventPacker.createUncancellableEvent(askForChoose), fromId);
                const response = await room.onReceivingAsyncResponseFrom(168 /* AskForChoosingOptionsEvent */, fromId);
                if (response.selectedOption !== 'jieyin:move') {
                    moveCard = false;
                }
            }
            if (moveCard) {
                await room.moveCards({
                    movingCards: cardIds.map(card => ({ card, fromArea: from.cardFrom(card) })),
                    fromId,
                    toId: to.Id,
                    toArea: 1 /* EquipArea */,
                    moveReason: 2 /* ActiveMove */,
                    movedByReason: this.Name,
                    proposer: fromId,
                });
            }
            else {
                await room.dropCards(4 /* SelfDrop */, cardIds, fromId, fromId, this.Name);
            }
        }
        else {
            await room.dropCards(4 /* SelfDrop */, cardIds, fromId, fromId, this.Name);
        }
        const weaker = from.Hp > to.Hp ? to : to.Hp > from.Hp ? from : undefined;
        if (weaker !== undefined) {
            await room.recover({
                recoveredHp: 1,
                toId: weaker.Id,
            });
            const stronger = from === weaker ? to : from;
            await room.drawCards(1, stronger.Id, 'top', undefined, this.Name);
        }
        return true;
    }
};
JieYin = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'jieyin', description: 'jieyin_description' })
], JieYin);
exports.JieYin = JieYin;
