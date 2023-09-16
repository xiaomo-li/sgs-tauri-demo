"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QingCe = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const zhengrong_1 = require("./zhengrong");
let QingCe = class QingCe extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return (owner.getCardIds(3 /* OutsideArea */, zhengrong_1.ZhengRong.Name).length > 0 &&
            owner.getCardIds(0 /* HandArea */).length > 0);
    }
    numberOfTargets() {
        return 1;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 2;
    }
    isAvailableTarget(owner, room, target) {
        const to = room.getPlayerById(target);
        return to.getCardIds(1 /* EquipArea */).length > 0 || to.getCardIds(2 /* JudgeArea */).length > 0;
    }
    isAvailableCard(owner, room, cardId, selectedCards) {
        const ownerPlayer = room.getPlayerById(owner);
        if (selectedCards.length > 0) {
            return ownerPlayer.cardFrom(cardId) === 0 /* HandArea */ && room.canDropCard(owner, cardId);
        }
        return ownerPlayer.getCardIds(3 /* OutsideArea */, zhengrong_1.ZhengRong.Name).includes(cardId);
    }
    availableCardAreas() {
        return [0 /* HandArea */, 3 /* OutsideArea */];
    }
    async onUse() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, toIds, cardIds } = event;
        if (!toIds || !cardIds) {
            return false;
        }
        await room.moveCards({
            movingCards: [{ card: cardIds[0], fromArea: 3 /* OutsideArea */ }],
            fromId,
            toId: fromId,
            moveReason: 2 /* ActiveMove */,
            toArea: 0 /* HandArea */,
            proposer: fromId,
            movedByReason: this.Name,
        });
        await room.moveCards({
            movingCards: [{ card: cardIds[1], fromArea: 0 /* HandArea */ }],
            fromId,
            moveReason: 6 /* PlaceToDropStack */,
            toArea: 4 /* DropStack */,
            proposer: fromId,
            movedByReason: this.Name,
        });
        const to = room.getPlayerById(toIds[0]);
        const options = {
            [1 /* EquipArea */]: to.getCardIds(1 /* EquipArea */),
            [2 /* JudgeArea */]: to.getCardIds(2 /* JudgeArea */),
        };
        const chooseCardEvent = {
            fromId,
            toId: toIds[0],
            options,
        };
        const response = await room.askForChoosingPlayerCard(chooseCardEvent, fromId, true, true);
        if (!response) {
            return false;
        }
        await room.moveCards({
            movingCards: [{ card: response.selectedCard, fromArea: response.fromArea }],
            fromId: toIds[0],
            toArea: 4 /* DropStack */,
            moveReason: 5 /* PassiveDrop */,
            proposer: fromId,
            movedByReason: this.Name,
        });
        return true;
    }
};
QingCe = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'qingce', description: 'qingce_description' })
], QingCe);
exports.QingCe = QingCe;
