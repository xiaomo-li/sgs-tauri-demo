"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuanShiFuSkill = void 0;
const tslib_1 = require("tslib");
const guanshifu_1 = require("core/ai/skills/cards/guanshifu");
const engine_1 = require("core/game/engine");
const precondition_1 = require("core/shares/libs/precondition/precondition");
const skill_1 = require("core/skills/skill");
let GuanShiFuSkill = class GuanShiFuSkill extends skill_1.TriggerSkill {
    get Muted() {
        return true;
    }
    isAutoTrigger() {
        return false;
    }
    isTriggerable(event, stage) {
        return stage === "CardEffectCancelledOut" /* CardEffectCancelledOut */;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 2;
    }
    isAvailableCard(owner, room, cardId, selectedCards, selectedTargets, containerCard) {
        return cardId !== containerCard;
    }
    canUse(room, owner, content) {
        return content.fromId === owner.Id && engine_1.Sanguosha.getCardById(content.cardId).GeneralName === 'slash';
    }
    async onTrigger(room, event) {
        return true;
    }
    async onEffect(room, event) {
        const { cardIds } = event;
        if (!cardIds) {
            return false;
        }
        await room.dropCards(4 /* SelfDrop */, cardIds, event.fromId);
        const { triggeredOnEvent } = event;
        const slashEvent = precondition_1.Precondition.exists(triggeredOnEvent, 'Unable to get slash event');
        slashEvent.isCancelledOut = false;
        return true;
    }
};
GuanShiFuSkill = tslib_1.__decorate([
    skill_1.AI(guanshifu_1.GuanShiFuSkillTrigger),
    skill_1.CommonSkill({ name: 'guanshifu', description: 'guanshifu_description' })
], GuanShiFuSkill);
exports.GuanShiFuSkill = GuanShiFuSkill;
