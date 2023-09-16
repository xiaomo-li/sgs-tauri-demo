"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GanLu = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
let GanLu = class GanLu extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return !owner.hasUsedSkill(this.Name);
    }
    numberOfTargets() {
        return 2;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 0;
    }
    isAvailableTarget(owner, room, target, selectedCards, selectedTargets) {
        if (selectedTargets.length === 1) {
            const first = room.getPlayerById(selectedTargets[0]);
            const second = room.getPlayerById(target);
            const firstEquipsNum = first.getCardIds(1 /* EquipArea */).length;
            const secondEquipsNum = second.getCardIds(1 /* EquipArea */).length;
            if (firstEquipsNum === 0 && secondEquipsNum === 0) {
                return false;
            }
            return (selectedTargets[0] === owner ||
                target === owner ||
                Math.abs(firstEquipsNum - secondEquipsNum) <= room.getPlayerById(owner).LostHp);
        }
        return true;
    }
    isAvailableCard() {
        return false;
    }
    async onUse() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const fromId = skillUseEvent.fromId;
        const firstId = skillUseEvent.toIds[0];
        const secondId = skillUseEvent.toIds[1];
        const first = room.getPlayerById(firstId);
        const second = room.getPlayerById(secondId);
        const firstCards = first.getCardIds(1 /* EquipArea */).slice();
        const secondCards = second.getCardIds(1 /* EquipArea */).slice();
        await room.moveCards({
            moveReason: 3 /* PassiveMove */,
            movingCards: firstCards.map(cardId => ({ card: cardId, fromArea: 1 /* EquipArea */ })),
            fromId: firstId,
            toArea: 6 /* ProcessingArea */,
            proposer: fromId,
            movedByReason: this.Name,
            engagedPlayerIds: [firstId],
        }, {
            moveReason: 3 /* PassiveMove */,
            movingCards: secondCards.map(cardId => ({ card: cardId, fromArea: 1 /* EquipArea */ })),
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
            toArea: 1 /* EquipArea */,
            proposer: fromId,
            movedByReason: this.Name,
            engagedPlayerIds: [firstId, secondId],
        }, {
            moveReason: 3 /* PassiveMove */,
            movingCards: firstCards.map(cardId => ({ card: cardId, fromArea: 6 /* ProcessingArea */ })),
            toId: secondId,
            toArea: 1 /* EquipArea */,
            proposer: fromId,
            movedByReason: this.Name,
            engagedPlayerIds: [firstId, secondId],
        });
        return true;
    }
};
GanLu = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'ganlu', description: 'ganlu_description' })
], GanLu);
exports.GanLu = GanLu;
