"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JinJiu = void 0;
const tslib_1 = require("tslib");
const card_1 = require("core/cards/card");
const engine_1 = require("core/game/engine");
const alcohol_1 = require("core/skills/cards/legion_fight/alcohol");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let JinJiu = class JinJiu extends skill_1.TransformSkill {
    async whenObtainingSkill(room, owner) {
        const cards = owner.getCardIds(0 /* HandArea */).map(cardId => {
            if (this.canTransform(owner, cardId)) {
                return this.forceToTransformCardTo(cardId).Id;
            }
            return cardId;
        });
        owner.setupCards(0 /* HandArea */, cards);
    }
    async whenLosingSkill(room, owner) {
        const cards = owner.getCardIds(0 /* HandArea */).map(cardId => {
            if (!card_1.Card.isVirtualCardId(cardId)) {
                return cardId;
            }
            const card = engine_1.Sanguosha.getCardById(cardId);
            if (!card.findByGeneratedSkill(this.Name)) {
                return cardId;
            }
            return card.ActualCardIds[0];
        });
        owner.setupCards(0 /* HandArea */, cards);
    }
    canTransform(owner, cardId) {
        const card = engine_1.Sanguosha.getCardById(cardId);
        return card.GeneralName === alcohol_1.AlcoholSkill.GeneralName;
    }
    includesJudgeCard() {
        return true;
    }
    forceToTransformCardTo(cardId) {
        const card = engine_1.Sanguosha.getCardById(cardId);
        return card_1.VirtualCard.create({
            cardName: 'slash',
            cardNumber: card.CardNumber,
            cardSuit: card.Suit,
            bySkill: this.Name,
        }, [cardId]);
    }
};
JinJiu = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'jinjiu', description: 'jinjiu_description' })
], JinJiu);
exports.JinJiu = JinJiu;
