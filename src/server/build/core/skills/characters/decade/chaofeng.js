"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChaoFengShadow = exports.ChaoFeng = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let ChaoFeng = class ChaoFeng extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return !owner.hasUsedSkill(this.Name);
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
    availableCardAreas() {
        return [0 /* HandArea */];
    }
    async onUse(room, event) {
        return true;
    }
    async onEffect(room, event) {
        if (!event.cardIds) {
            return false;
        }
        await room.dropCards(4 /* SelfDrop */, event.cardIds, event.fromId, event.fromId, this.Name);
        await room.drawCards(1, event.fromId, 'top', event.fromId, this.Name);
        return true;
    }
};
ChaoFeng = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'chaofeng', description: 'chaofeng_description' })
], ChaoFeng);
exports.ChaoFeng = ChaoFeng;
let ChaoFengShadow = class ChaoFengShadow extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "DamageEffect" /* DamageEffect */;
    }
    canUse(room, owner, content) {
        return content.fromId === owner.Id && owner.getCardIds(0 /* HandArea */).length > 0;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    isAvailableCard(owner, room, cardId) {
        return room.canDropCard(owner, cardId);
    }
    availableCardAreas() {
        return [0 /* HandArea */];
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        if (!event.cardIds) {
            return false;
        }
        await room.dropCards(4 /* SelfDrop */, event.cardIds, event.fromId, event.fromId, this.Name);
        let num = 1;
        const damageEvent = event.triggeredOnEvent;
        if (damageEvent.cardIds) {
            const damageCard = engine_1.Sanguosha.getCardById(damageEvent.cardIds[0]);
            const droppedCard = engine_1.Sanguosha.getCardById(event.cardIds[0]);
            damageCard.Color === droppedCard.Color && num++;
            damageCard.BaseType === droppedCard.BaseType && damageEvent.damage++;
        }
        await room.drawCards(num, event.fromId, 'top', event.fromId, this.Name);
        return true;
    }
};
ChaoFengShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.CommonSkill({ name: ChaoFeng.Name, description: ChaoFeng.Description })
], ChaoFengShadow);
exports.ChaoFengShadow = ChaoFengShadow;
