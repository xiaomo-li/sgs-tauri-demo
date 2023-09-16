"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TianYin = void 0;
const tslib_1 = require("tslib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let TianYin = class TianYin extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, event) {
        return event.playerId === owner.Id && event.toStage === 19 /* FinishStageStart */;
    }
    async beforeUse(room, event) {
        const cardTypes = [];
        for (const record of room.Analytics.getCardUseRecord(event.fromId, 'round')) {
            const type = engine_1.Sanguosha.getCardById(record.cardId).BaseType;
            cardTypes.includes(type) || cardTypes.push(type);
            if (cardTypes.length === 3) {
                break;
            }
        }
        event_packer_1.EventPacker.addMiddleware({ tag: this.Name, data: cardTypes }, event);
        return cardTypes.length < 3;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const cardTypes = event_packer_1.EventPacker.getMiddleware(this.Name, event) || [];
        const differentTypes = [0 /* Basic */, 7 /* Trick */, 1 /* Equip */].filter(type => !cardTypes.includes(type));
        const cardIdsChosen = [];
        for (const cardType of differentTypes) {
            const cardIds = room.findCardsByMatcherFrom(new card_matcher_1.CardMatcher({ type: [cardType] }));
            cardIds.length > 0 && cardIdsChosen.push(cardIds[Math.floor(Math.random() * cardIds.length)]);
        }
        cardIdsChosen.length > 0 &&
            (await room.moveCards({
                movingCards: cardIdsChosen.map(card => ({ card, fromArea: 5 /* DrawStack */ })),
                toId: event.fromId,
                toArea: 0 /* HandArea */,
                moveReason: 1 /* ActivePrey */,
                proposer: event.fromId,
                triggeredBySkills: [this.Name],
            }));
        return true;
    }
};
TianYin = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'tianyin', description: 'tianyin_description' })
], TianYin);
exports.TianYin = TianYin;
