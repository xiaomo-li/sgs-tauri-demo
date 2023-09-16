"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KuRou = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
let KuRou = class KuRou extends skill_1.ActiveSkill {
    canUse(room, owner) {
        const handCards = owner.getCardIds(0 /* HandArea */);
        const equipmentCards = owner.getCardIds(1 /* EquipArea */);
        return !owner.hasUsedSkill(this.Name) && handCards.length + equipmentCards.length > 0;
    }
    numberOfTargets() {
        return 0;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    isAvailableTarget() {
        return false;
    }
    isAvailableCard(owner, room, cardId) {
        return room.canDropCard(owner, cardId);
    }
    async onUse() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        await room.dropCards(4 /* SelfDrop */, skillUseEvent.cardIds, skillUseEvent.fromId, skillUseEvent.fromId, this.Name);
        await room.loseHp(skillUseEvent.fromId, 1);
        return true;
    }
};
KuRou = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'kurou', description: 'kurou_description' })
], KuRou);
exports.KuRou = KuRou;
