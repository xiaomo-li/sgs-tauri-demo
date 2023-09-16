"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaiYi = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const quanji_1 = require("./quanji");
let PaiYi = class PaiYi extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return !owner.hasUsedSkill(this.Name) && owner.getCardIds(3 /* OutsideArea */, quanji_1.QuanJi.Name).length > 0;
    }
    numberOfTargets() {
        return 1;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    isAvailableTarget() {
        return true;
    }
    isAvailableCard(owner, room, cardId) {
        const player = room.getPlayerById(owner);
        return player.getCardIds(3 /* OutsideArea */, quanji_1.QuanJi.Name).includes(cardId);
    }
    availableCardAreas() {
        return [3 /* OutsideArea */];
    }
    async onUse() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, toIds, cardIds } = event;
        await room.moveCards({
            movingCards: [{ card: cardIds[0], fromArea: 3 /* OutsideArea */ }],
            fromId,
            moveReason: 6 /* PlaceToDropStack */,
            toArea: 4 /* DropStack */,
            proposer: fromId,
            movedByReason: this.Name,
        });
        await room.drawCards(2, toIds[0], 'top', fromId, this.Name);
        if (fromId === toIds[0]) {
            return true;
        }
        const fromHandNum = room.getPlayerById(fromId).getCardIds(0 /* HandArea */).length;
        const toHandNum = room.getPlayerById(toIds[0]).getCardIds(0 /* HandArea */).length;
        if (toHandNum > fromHandNum) {
            await room.damage({
                fromId,
                toId: toIds[0],
                damage: 1,
                damageType: "normal_property" /* Normal */,
                triggeredBySkills: [this.Name],
            });
        }
        return true;
    }
};
PaiYi = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'paiyi', description: 'paiyi_description' })
], PaiYi);
exports.PaiYi = PaiYi;
