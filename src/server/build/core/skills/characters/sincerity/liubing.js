"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiuBing = void 0;
const tslib_1 = require("tslib");
const card_1 = require("core/cards/card");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let LiuBing = class LiuBing extends skill_1.TriggerSkill {
    audioIndex() {
        return 0;
    }
    isRefreshAt(room, owner, stage) {
        return stage === 0 /* PhaseBegin */;
    }
    isTriggerable(event, stage) {
        return stage === "AfterCardUseDeclared" /* AfterCardUseDeclared */;
    }
    canUse(room, owner, content) {
        const cardUsed = engine_1.Sanguosha.getCardById(content.cardId);
        return (!owner.hasUsedSkill(this.Name) &&
            content.fromId === owner.Id &&
            cardUsed.Suit !== 0 /* NoSuit */ &&
            cardUsed.GeneralName === 'slash');
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const cardUseEvent = event.triggeredOnEvent;
        const cardUsed = engine_1.Sanguosha.getCardById(cardUseEvent.cardId);
        cardUseEvent.cardId = card_1.VirtualCard.create({ cardName: cardUsed.Name, cardSuit: 4 /* Diamond */, cardNumber: cardUsed.CardNumber, bySkill: this.Name }, [cardUseEvent.cardId]).Id;
        return true;
    }
};
LiuBing = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'liubing', description: 'liubing_description' })
], LiuBing);
exports.LiuBing = LiuBing;
