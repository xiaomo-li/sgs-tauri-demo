"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WuShenDisresponse = exports.WuShenShadow = exports.WuShen = void 0;
const tslib_1 = require("tslib");
const card_1 = require("core/cards/card");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const game_props_1 = require("core/game/game_props");
const skill_1 = require("core/skills/skill");
let WuShen = class WuShen extends skill_1.TransformSkill {
    async whenObtainingSkill(room, owner) {
        const cards = owner.getCardIds(0 /* HandArea */).map(cardId => {
            if (this.canTransform(owner, cardId, 0 /* HandArea */)) {
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
    canTransform(owner, cardId, area) {
        const card = engine_1.Sanguosha.getCardById(cardId);
        return card.Suit === 2 /* Heart */ && area === 0 /* HandArea */;
    }
    forceToTransformCardTo(cardId) {
        const card = engine_1.Sanguosha.getCardById(cardId);
        return card_1.VirtualCard.create({
            cardName: 'slash',
            cardNumber: card.CardNumber,
            cardSuit: 2 /* Heart */,
            bySkill: this.Name,
        }, [cardId]);
    }
};
WuShen = tslib_1.__decorate([
    skill_1.CompulsorySkill({ name: 'wushen', description: 'wushen_description' })
], WuShen);
exports.WuShen = WuShen;
let WuShenShadow = class WuShenShadow extends skill_1.RulesBreakerSkill {
    breakCardUsableMethod(cardId) {
        let match = false;
        if (cardId instanceof card_matcher_1.CardMatcher) {
            match = cardId.match(new card_matcher_1.CardMatcher({ suit: [2 /* Heart */], generalName: ['slash'] }));
        }
        else {
            const card = engine_1.Sanguosha.getCardById(cardId);
            match = card.GeneralName === 'slash' && card.Suit === 2 /* Heart */;
        }
        return match ? game_props_1.INFINITE_TRIGGERING_TIMES : 0;
    }
    breakCardUsableDistance(cardId) {
        return this.breakCardUsableMethod(cardId);
    }
    breakCardUsableTimes(cardId) {
        return this.breakCardUsableMethod(cardId);
    }
};
WuShenShadow = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.CompulsorySkill({ name: WuShen.Name, description: WuShen.Description })
], WuShenShadow);
exports.WuShenShadow = WuShenShadow;
let WuShenDisresponse = class WuShenDisresponse extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterAim" /* AfterAim */;
    }
    canUse(room, owner, event) {
        const card = event.byCardId && engine_1.Sanguosha.getCardById(event.byCardId);
        return event.fromId === owner.Id && !!card && card.GeneralName === 'slash' && card.Suit === 2 /* Heart */;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillEffectEvent) {
        const aimEvent = skillEffectEvent.triggeredOnEvent;
        event_packer_1.EventPacker.setDisresponsiveEvent(aimEvent);
        return true;
    }
};
WuShenDisresponse = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.CompulsorySkill({ name: WuShenShadow.Name, description: WuShenShadow.Description })
], WuShenDisresponse);
exports.WuShenDisresponse = WuShenDisresponse;
