"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShaMeng = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
let ShaMeng = class ShaMeng extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return !owner.hasUsedSkill(this.Name) && owner.getCardIds(0 /* HandArea */).length > 1;
    }
    numberOfTargets() {
        return 1;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 2;
    }
    isAvailableTarget(owner, room, target) {
        return owner !== target;
    }
    isAvailableCard(owner, room, cardId, selectedCards) {
        if (!room.canDropCard(owner, cardId)) {
            return false;
        }
        if (selectedCards.length === 1) {
            return engine_1.Sanguosha.getCardById(cardId).Color === engine_1.Sanguosha.getCardById(selectedCards[0]).Color;
        }
        return true;
    }
    availableCardAreas() {
        return [0 /* HandArea */];
    }
    async onUse() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, toIds, cardIds } = event;
        if (!toIds || !cardIds) {
            return false;
        }
        await room.dropCards(4 /* SelfDrop */, cardIds, fromId, fromId, this.Name);
        await room.drawCards(2, toIds[0], 'top', fromId, this.Name);
        await room.drawCards(3, fromId, 'top', fromId, this.Name);
        return true;
    }
};
ShaMeng = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'shameng', description: 'shameng_description' })
], ShaMeng);
exports.ShaMeng = ShaMeng;
