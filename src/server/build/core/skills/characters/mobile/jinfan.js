"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JinFanShadow = exports.JinFan = void 0;
const tslib_1 = require("tslib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let JinFan = class JinFan extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        return (content.playerId === owner.Id &&
            content.toStage === 16 /* DropCardStageStart */ &&
            owner.getCardIds(0 /* HandArea */).length > 0 &&
            owner.getCardIds(3 /* OutsideArea */, this.Name).length < 4);
    }
    cardFilter(room, owner, cards) {
        return cards.length > 0 && cards.length <= 4 - owner.getCardIds(3 /* OutsideArea */, this.Name).length;
    }
    isAvailableCard(owner, room, cardId, selectedCards) {
        const ownerPlayer = room.getPlayerById(owner);
        const suits = [...ownerPlayer.getCardIds(3 /* OutsideArea */, this.Name), ...selectedCards].reduce((allSuits, id) => {
            const suit = engine_1.Sanguosha.getCardById(id).Suit;
            allSuits.includes(suit) || allSuits.push(suit);
            return allSuits;
        }, []);
        return !suits.includes(engine_1.Sanguosha.getCardById(cardId).Suit);
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
        await room.moveCards({
            movingCards: event.cardIds.map(card => ({ card, fromArea: 0 /* HandArea */ })),
            fromId: event.fromId,
            toId: event.fromId,
            toArea: 3 /* OutsideArea */,
            moveReason: 2 /* ActiveMove */,
            proposer: event.fromId,
            isOutsideAreaInPublic: true,
            toOutsideArea: this.Name,
            triggeredBySkills: [this.Name],
        });
        return true;
    }
};
JinFan = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'jinfan', description: 'jinfan_description' })
], JinFan);
exports.JinFan = JinFan;
let JinFanShadow = class JinFanShadow extends skill_1.TriggerSkill {
    isAutoTrigger() {
        return true;
    }
    isFlaggedSkill(room, event, stage) {
        return stage === "CardMoving" /* CardMoving */;
    }
    isTriggerable(event, stage) {
        return stage === "CardMoving" /* CardMoving */ || stage === "AfterCardMoved" /* AfterCardMoved */;
    }
    canUse(room, owner, content, stage) {
        if (stage === "CardMoving" /* CardMoving */) {
            const ling = content.infos
                .filter(info => info.fromId === owner.Id &&
                info.movingCards.find(cardInfo => cardInfo.fromArea === 3 /* OutsideArea */ &&
                    owner.getOutsideAreaNameOf(cardInfo.card) === this.GeneralName))
                .reduce((allCards, info) => {
                if (info.fromId === owner.Id) {
                    allCards.push(...info.movingCards
                        .filter(cardInfo => cardInfo.fromArea === 3 /* OutsideArea */ &&
                        owner.getOutsideAreaNameOf(cardInfo.card) === this.GeneralName)
                        .map(cardInfo => cardInfo.card));
                }
                return allCards;
            }, []);
            if (ling.length > 0) {
                event_packer_1.EventPacker.addMiddleware({ tag: this.GeneralName, data: ling }, content);
            }
        }
        return (stage === "AfterCardMoved" /* AfterCardMoved */ &&
            event_packer_1.EventPacker.getMiddleware(this.GeneralName, content) !== undefined);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const ling = event_packer_1.EventPacker.getMiddleware(this.GeneralName, event.triggeredOnEvent);
        const suits = ling.reduce((allSuits, id) => {
            const suit = engine_1.Sanguosha.getCardById(id).Suit;
            allSuits.includes(suit) || allSuits.push(suit);
            return allSuits;
        }, []);
        const toGain = [];
        for (const suit of suits) {
            const randomCards = room.findCardsByMatcherFrom(new card_matcher_1.CardMatcher({ suit: [suit] }));
            randomCards.length > 0 && toGain.push(randomCards[Math.floor(Math.random() * randomCards.length)]);
        }
        toGain.length > 0 &&
            (await room.moveCards({
                movingCards: toGain.map(card => ({ card, fromArea: 5 /* DrawStack */ })),
                toId: event.fromId,
                toArea: 0 /* HandArea */,
                moveReason: 1 /* ActivePrey */,
                proposer: event.fromId,
                triggeredBySkills: [this.GeneralName],
            }));
        return true;
    }
};
JinFanShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.CommonSkill({ name: JinFan.Name, description: JinFan.Description })
], JinFanShadow);
exports.JinFanShadow = JinFanShadow;
