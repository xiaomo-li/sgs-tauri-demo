"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MouLieGongHandler = exports.MouLieGongTransform = exports.MouLieGongShadow = exports.MouLieGong = void 0;
const tslib_1 = require("tslib");
const card_1 = require("core/cards/card");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const algorithm_1 = require("core/shares/libs/algorithm");
const functional_1 = require("core/shares/libs/functional");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let MouLieGong = class MouLieGong extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterAim" /* AfterAim */;
    }
    canUse(room, owner, event) {
        return (event.fromId === owner.Id &&
            !!owner.getFlag(this.Name) &&
            owner.getFlag(this.Name).length > 0 &&
            engine_1.Sanguosha.getCardById(event.byCardId).GeneralName === 'slash');
    }
    getSkillLog(room, owner, event) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to use this skill to {1} ?', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(event.toId))).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const aimEvent = event.triggeredOnEvent;
        const mouLiegongSuits = room.getFlag(event.fromId, this.Name) || [];
        if (mouLiegongSuits.length > 1) {
            const displayCards = room.getCards(mouLiegongSuits.length - 1, 'top');
            const cardDisplayEvent = {
                displayCards,
                fromId: event.fromId,
                translationsMessage: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} used skill {1}, display cards: {2}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(event.fromId)), this.Name, translation_json_tool_1.TranslationPack.patchCardInTranslation(...displayCards)).extract(),
            };
            room.broadcast(126 /* CardDisplayEvent */, cardDisplayEvent);
            const numberOfSameSuits = displayCards.reduce((sum, cardId) => {
                const suit = engine_1.Sanguosha.getCardById(cardId).Suit;
                mouLiegongSuits.includes(suit) && sum++;
                return sum;
            }, 0);
            await room.moveCards({
                movingCards: displayCards.map(card => ({ card, fromArea: 6 /* ProcessingArea */ })),
                moveReason: 6 /* PlaceToDropStack */,
                toArea: 4 /* DropStack */,
                hideBroadcast: true,
                movedByReason: this.Name,
            });
            aimEvent.additionalDamage = (aimEvent.additionalDamage || 0) + numberOfSameSuits;
        }
        event_packer_1.EventPacker.addMiddleware({ tag: this.Name, data: mouLiegongSuits }, aimEvent);
        return true;
    }
};
MouLieGong = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'mou_liegong', description: 'mou_liegong_description' })
], MouLieGong);
exports.MouLieGong = MouLieGong;
let MouLieGongShadow = class MouLieGongShadow extends skill_1.TriggerSkill {
    isAutoTrigger() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "CardUsing" /* CardUsing */ || stage === "AfterAimmed" /* AfterAimmed */;
    }
    canUse(room, owner, event) {
        const mouLiegongSuits = owner.getFlag(this.GeneralName) || [];
        const identifier = event_packer_1.EventPacker.getIdentifier(event);
        if (identifier === 124 /* CardUseEvent */) {
            const cardUseEvent = event;
            return (cardUseEvent.fromId === owner.Id &&
                engine_1.Sanguosha.getCardById(cardUseEvent.cardId).Suit !== 0 /* NoSuit */ &&
                !mouLiegongSuits.includes(engine_1.Sanguosha.getCardById(cardUseEvent.cardId).Suit));
        }
        else if (identifier === 131 /* AimEvent */) {
            const aimEvent = event;
            return (aimEvent.toId === owner.Id &&
                aimEvent.fromId !== owner.Id &&
                engine_1.Sanguosha.getCardById(aimEvent.byCardId).Suit !== 0 /* NoSuit */ &&
                !mouLiegongSuits.includes(engine_1.Sanguosha.getCardById(aimEvent.byCardId).Suit));
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const mouLiegongSuits = room.getFlag(event.fromId, this.GeneralName) || [];
        mouLiegongSuits.push(engine_1.Sanguosha.getCardById(event_packer_1.EventPacker.getIdentifier(event.triggeredOnEvent) === 124 /* CardUseEvent */
            ? event.triggeredOnEvent.cardId
            : event.triggeredOnEvent.byCardId).Suit);
        let text = '{0}[';
        for (const suit of mouLiegongSuits) {
            text += functional_1.Functional.getCardSuitCharText(suit);
        }
        text += ']';
        room.setFlag(event.fromId, this.GeneralName, mouLiegongSuits, translation_json_tool_1.TranslationPack.translationJsonPatcher(text, this.GeneralName).toString());
        return true;
    }
};
MouLieGongShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.CommonSkill({ name: MouLieGong.Name, description: MouLieGong.Description })
], MouLieGongShadow);
exports.MouLieGongShadow = MouLieGongShadow;
let MouLieGongTransform = class MouLieGongTransform extends skill_1.TransformSkill {
    async whenObtainingSkill(room, owner) {
        if (owner.getEquipment(2 /* Weapon */)) {
            return;
        }
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
            if (!card.findByGeneratedSkill(this.GeneralName)) {
                return cardId;
            }
            return card.ActualCardIds[0];
        });
        owner.setupCards(0 /* HandArea */, cards);
    }
    canTransform(owner, cardId, area) {
        if (owner.getEquipment(2 /* Weapon */)) {
            return false;
        }
        const card = engine_1.Sanguosha.getCardById(cardId);
        return card.GeneralName === 'slash' && card.Name !== 'slash';
    }
    forceToTransformCardTo(cardId) {
        return card_1.VirtualCard.create({
            cardName: 'slash',
            bySkill: this.GeneralName,
        }, [cardId]);
    }
};
MouLieGongTransform = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.CommonSkill({ name: MouLieGongShadow.Name, description: MouLieGongShadow.Description })
], MouLieGongTransform);
exports.MouLieGongTransform = MouLieGongTransform;
let MouLieGongHandler = class MouLieGongHandler extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 0 /* PhaseBegin */ && stage === "BeforePhaseChange" /* BeforePhaseChange */;
    }
    afterDead(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 0 /* PhaseBegin */ && stage === "BeforePhaseChange" /* BeforePhaseChange */;
    }
    isAutoTrigger() {
        return true;
    }
    isFlaggedSkill() {
        return true;
    }
    isTriggerable(event, stage) {
        return (event_packer_1.EventPacker.getIdentifier(event) === 160 /* AskForCardUseEvent */ ||
            stage === "CardUseFinishedEffect" /* CardUseFinishedEffect */);
    }
    canUse(room, owner, event) {
        const identifier = event_packer_1.EventPacker.getIdentifier(event);
        if (identifier === 160 /* AskForCardUseEvent */) {
            const askForCardUseEvent = event;
            const cardEffectEvent = askForCardUseEvent.triggeredOnEvent;
            return (!!cardEffectEvent &&
                event_packer_1.EventPacker.getIdentifier(cardEffectEvent) === 125 /* CardEffectEvent */ &&
                !!event_packer_1.EventPacker.getMiddleware(this.GeneralName, cardEffectEvent));
        }
        else if (identifier === 124 /* CardUseEvent */) {
            const cardUseEvent = event;
            return (cardUseEvent.fromId === owner.Id &&
                !!event_packer_1.EventPacker.getMiddleware(this.GeneralName, cardUseEvent) &&
                !!owner.getFlag(this.GeneralName));
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const unknownEvent = event.triggeredOnEvent;
        if (event_packer_1.EventPacker.getIdentifier(unknownEvent) === 160 /* AskForCardUseEvent */) {
            const askForCardUseEvent = unknownEvent;
            const availableSuits = algorithm_1.Algorithm.unique([1 /* Spade */, 3 /* Club */, 4 /* Diamond */, 2 /* Heart */, 0 /* NoSuit */], event_packer_1.EventPacker.getMiddleware(this.GeneralName, askForCardUseEvent.triggeredOnEvent));
            askForCardUseEvent.cardMatcher.suit = (askForCardUseEvent.cardMatcher.suit || []).concat(...availableSuits);
        }
        else {
            room.removeFlag(event.fromId, this.GeneralName);
        }
        return true;
    }
};
MouLieGongHandler = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: MouLieGongTransform.Name, description: MouLieGongTransform.Description })
], MouLieGongHandler);
exports.MouLieGongHandler = MouLieGongHandler;
