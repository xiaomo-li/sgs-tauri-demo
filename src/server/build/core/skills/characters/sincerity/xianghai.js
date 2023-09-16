"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XiangHaiShadow = exports.XiangHai = void 0;
const tslib_1 = require("tslib");
const card_1 = require("core/cards/card");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
let XiangHai = class XiangHai extends skill_1.TransformSkill {
    async whenObtainingSkill(room, owner) {
        const cards = owner.getCardIds(0 /* HandArea */).map(cardId => {
            if (this.canTransform(owner, cardId, 0 /* HandArea */)) {
                return this.forceToTransformCardTo(cardId).Id;
            }
            return cardId;
        });
        room.broadcast(107 /* PlayerPropertiesChangeEvent */, {
            changedProperties: [
                {
                    toId: owner.Id,
                    handCards: cards,
                },
            ],
        });
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
    canTransform(owner, cardId, area) {
        const card = engine_1.Sanguosha.getCardById(cardId);
        return card.is(1 /* Equip */) && area === 0 /* HandArea */;
    }
    forceToTransformCardTo(cardId) {
        return card_1.VirtualCard.create({
            cardName: 'alcohol',
            bySkill: this.Name,
        }, [cardId]);
    }
};
XiangHai = tslib_1.__decorate([
    skill_1.CompulsorySkill({ name: 'xianghai', description: 'xianghai_description' })
], XiangHai);
exports.XiangHai = XiangHai;
let XiangHaiShadow = class XiangHaiShadow extends skill_1.GlobalRulesBreakerSkill {
    breakAdditionalCardHold(room, owner, target) {
        return target !== owner ? -1 : 0;
    }
};
XiangHaiShadow = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.CompulsorySkill({ name: XiangHai.Name, description: XiangHai.Description })
], XiangHaiShadow);
exports.XiangHaiShadow = XiangHaiShadow;
