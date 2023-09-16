"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiMeng = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
let DiMeng = class DiMeng extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return !owner.hasUsedSkill(this.Name);
    }
    numberOfTargets() {
        return 2;
    }
    cardFilter(room, owner, cards, selectedTargets) {
        if (selectedTargets.length !== this.numberOfTargets()) {
            return false;
        }
        const first = room.getPlayerById(selectedTargets[0]);
        const second = room.getPlayerById(selectedTargets[1]);
        const firstHandcardNum = first.getCardIds(0 /* HandArea */).length;
        const secondHandcardNum = second.getCardIds(0 /* HandArea */).length;
        return cards.length === Math.abs(firstHandcardNum - secondHandcardNum);
    }
    isAvailableTarget(owner, room, target, selectedCards, selectedTargets) {
        if (selectedTargets.length === 0) {
            return owner !== target;
        }
        const first = room.getPlayerById(selectedTargets[0]);
        const second = room.getPlayerById(target);
        const firstHandcardNum = first.getCardIds(0 /* HandArea */).length;
        const secondHandcardNum = second.getCardIds(0 /* HandArea */).length;
        return (owner !== target &&
            room.getPlayerById(owner).getPlayerCards().length >= Math.abs(firstHandcardNum - secondHandcardNum));
    }
    isAvailableCard(owner, room, cardId) {
        return room.canDropCard(owner, cardId);
    }
    async onUse(room, event) {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        if (skillUseEvent.cardIds) {
            await room.dropCards(4 /* SelfDrop */, skillUseEvent.cardIds, skillUseEvent.fromId, skillUseEvent.fromId, this.Name);
        }
        const fromId = skillUseEvent.fromId;
        const firstId = skillUseEvent.toIds[0];
        const secondId = skillUseEvent.toIds[1];
        const first = room.getPlayerById(firstId);
        const second = room.getPlayerById(secondId);
        const firstCards = first.getCardIds(0 /* HandArea */).slice();
        const secondCards = second.getCardIds(0 /* HandArea */).slice();
        await room.moveCards({
            moveReason: 3 /* PassiveMove */,
            movingCards: firstCards.map(cardId => ({ card: cardId, fromArea: 0 /* HandArea */ })),
            fromId: firstId,
            toArea: 6 /* ProcessingArea */,
            proposer: fromId,
            movedByReason: this.Name,
            engagedPlayerIds: [firstId],
        }, {
            moveReason: 3 /* PassiveMove */,
            movingCards: secondCards.map(cardId => ({ card: cardId, fromArea: 0 /* HandArea */ })),
            fromId: secondId,
            toArea: 6 /* ProcessingArea */,
            proposer: fromId,
            movedByReason: this.Name,
            engagedPlayerIds: [secondId],
        });
        await room.moveCards({
            moveReason: 3 /* PassiveMove */,
            movingCards: secondCards.map(cardId => ({ card: cardId, fromArea: 6 /* ProcessingArea */ })),
            toId: firstId,
            toArea: 0 /* HandArea */,
            proposer: fromId,
            movedByReason: this.Name,
            engagedPlayerIds: [firstId, secondId],
        }, {
            moveReason: 3 /* PassiveMove */,
            movingCards: firstCards.map(cardId => ({ card: cardId, fromArea: 6 /* ProcessingArea */ })),
            toId: secondId,
            toArea: 0 /* HandArea */,
            proposer: fromId,
            movedByReason: this.Name,
            engagedPlayerIds: [firstId, secondId],
        });
        return true;
    }
};
DiMeng = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'dimeng', description: 'dimeng_description' })
], DiMeng);
exports.DiMeng = DiMeng;
