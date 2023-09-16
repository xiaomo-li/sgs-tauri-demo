"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HongYanShadow = exports.HongYan = void 0;
const tslib_1 = require("tslib");
const card_1 = require("core/cards/card");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
let HongYan = class HongYan extends skill_1.TransformSkill {
    async whenObtainingSkill(room, owner) {
        const handcards = owner.getCardIds(0 /* HandArea */).map(cardId => {
            if (this.canTransform(owner, cardId)) {
                return this.forceToTransformCardTo(cardId).Id;
            }
            return cardId;
        });
        owner.setupCards(0 /* HandArea */, handcards);
        const equips = owner.getCardIds(1 /* EquipArea */).map(cardId => {
            if (this.canTransform(owner, cardId)) {
                return this.forceToTransformCardTo(cardId).Id;
            }
            return cardId;
        });
        owner.setupCards(1 /* EquipArea */, equips);
    }
    async whenLosingSkill(room, owner) {
        const handcards = owner.getCardIds(0 /* HandArea */).map(cardId => {
            if (!card_1.Card.isVirtualCardId(cardId)) {
                return cardId;
            }
            const card = engine_1.Sanguosha.getCardById(cardId);
            if (!card.findByGeneratedSkill(this.Name)) {
                return cardId;
            }
            return card.ActualCardIds[0];
        });
        owner.setupCards(0 /* HandArea */, handcards);
        const equipCards = owner.getCardIds(1 /* EquipArea */).map(cardId => {
            if (!card_1.Card.isVirtualCardId(cardId)) {
                return cardId;
            }
            const card = engine_1.Sanguosha.getCardById(cardId);
            if (!card.findByGeneratedSkill(this.Name)) {
                return cardId;
            }
            return card.ActualCardIds[0];
        });
        owner.setupCards(1 /* EquipArea */, equipCards);
    }
    canTransform(owner, cardId) {
        const card = engine_1.Sanguosha.getCardById(cardId);
        return card.Suit === 1 /* Spade */;
    }
    includesJudgeCard() {
        return true;
    }
    forceToTransformCardTo(cardId) {
        const card = engine_1.Sanguosha.getCardById(cardId);
        return card_1.VirtualCard.create({
            cardName: card.Name,
            cardNumber: card.CardNumber,
            cardSuit: 2 /* Heart */,
            bySkill: this.Name,
        }, [cardId]);
    }
};
HongYan = tslib_1.__decorate([
    skill_1.CompulsorySkill({ name: 'hongyan', description: 'hongyan_description' })
], HongYan);
exports.HongYan = HongYan;
let HongYanShadow = class HongYanShadow extends skill_1.RulesBreakerSkill {
    breakBaseCardHoldNumber(room, owner) {
        if (owner
            .getCardIds(1 /* EquipArea */)
            .find(cardId => engine_1.Sanguosha.getCardById(cardId).Suit === 2 /* Heart */) !== undefined) {
            return owner.MaxHp;
        }
        return -1;
    }
};
HongYanShadow = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.CompulsorySkill({ name: HongYan.Name, description: HongYan.Description })
], HongYanShadow);
exports.HongYanShadow = HongYanShadow;
