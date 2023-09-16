"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HuoMoRecord = exports.HuoMoShadow = exports.HuoMo = void 0;
const tslib_1 = require("tslib");
const card_1 = require("core/cards/card");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const precondition_1 = require("core/shares/libs/precondition/precondition");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let HuoMo = class HuoMo extends skill_1.ViewAsSkill {
    async whenObtainingSkill(room, player) {
        const records = room.Analytics.getRecordEvents(event => event_packer_1.EventPacker.getIdentifier(event) === 124 /* CardUseEvent */ &&
            event.fromId === player.Id &&
            engine_1.Sanguosha.getCardById(event.cardId).is(0 /* Basic */), undefined, 'round');
        for (const event of records) {
            const cardId = event.cardId;
            const usedCards = room.getFlag(player.Id, this.GeneralName) || [];
            if (!usedCards.includes(engine_1.Sanguosha.getCardById(cardId).GeneralName)) {
                const slashName = engine_1.Sanguosha.getCardById(cardId).GeneralName;
                if (slashName === 'slash') {
                    usedCards.push('slash', 'thunder_slash', 'fire_slash');
                }
                else {
                    usedCards.push(engine_1.Sanguosha.getCardById(cardId).GeneralName);
                }
                room.setFlag(player.Id, this.GeneralName, usedCards);
            }
        }
    }
    canViewAs(room, owner) {
        const usedCards = owner.getFlag(this.Name) || [];
        return engine_1.Sanguosha.getCardNameByType(types => types.includes(0 /* Basic */)).filter(name => !usedCards.includes(name));
    }
    canUse(room, owner, event) {
        const identifier = event && event_packer_1.EventPacker.getIdentifier(event);
        const usedCards = owner.getFlag(this.Name) || [];
        if (identifier === 160 /* AskForCardUseEvent */) {
            return (engine_1.Sanguosha.getCardNameByType(types => types.includes(0 /* Basic */)).find(name => !usedCards.includes(name) &&
                owner.canUseCard(room, new card_matcher_1.CardMatcher({ name: [name] }), new card_matcher_1.CardMatcher(event.cardMatcher))) !== undefined);
        }
        return (identifier !== 159 /* AskForCardResponseEvent */ &&
            engine_1.Sanguosha.getCardNameByType(types => types.includes(0 /* Basic */)).find(name => !usedCards.includes(name) && owner.canUseCard(room, new card_matcher_1.CardMatcher({ name: [name] }))) !== undefined);
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    isAvailableCard(room, owner, pendingCardId) {
        return !engine_1.Sanguosha.getCardById(pendingCardId).is(0 /* Basic */) && engine_1.Sanguosha.getCardById(pendingCardId).isBlack();
    }
    availableCardAreas() {
        return [0 /* HandArea */, 1 /* EquipArea */];
    }
    viewAs(selectedCards, owner, viewAs) {
        precondition_1.Precondition.assert(!!viewAs, 'Unknown huomo card');
        return card_1.VirtualCard.create({
            cardName: viewAs,
            bySkill: this.Name,
            cardNumber: 0,
            cardSuit: 0 /* NoSuit */,
            hideActualCard: true,
        }, selectedCards);
    }
};
HuoMo = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'huomo', description: 'huomo_description' })
], HuoMo);
exports.HuoMo = HuoMo;
let HuoMoShadow = class HuoMoShadow extends skill_1.TriggerSkill {
    isAutoTrigger() {
        return true;
    }
    isFlaggedSkill() {
        return true;
    }
    get Muted() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "PreCardUse" /* PreCardUse */ && card_1.Card.isVirtualCardId(event.cardId);
    }
    canUse(room, owner, content) {
        return (content.fromId === owner.Id &&
            engine_1.Sanguosha.getCardById(content.cardId).findByGeneratedSkill(this.GeneralName));
    }
    async onTrigger(room, event) {
        event.translationsMessage = undefined;
        return true;
    }
    async onEffect(room, event) {
        const cardEvent = event.triggeredOnEvent;
        const preuseCard = engine_1.Sanguosha.getCardById(cardEvent.cardId);
        const realCard = preuseCard.ActualCardIds[0];
        const from = room.getPlayerById(cardEvent.fromId);
        await room.moveCards({
            fromId: event.fromId,
            movingCards: [
                {
                    card: realCard,
                    fromArea: from.cardFrom(realCard),
                },
            ],
            moveReason: 2 /* ActiveMove */,
            toArea: 5 /* DrawStack */,
            movedByReason: this.GeneralName,
            translationsMessage: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} placed card {1} on the top of draw stack', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(from), translation_json_tool_1.TranslationPack.patchCardInTranslation(realCard)).extract(),
        });
        cardEvent.cardId = card_1.VirtualCard.create({
            bySkill: this.GeneralName,
            cardName: preuseCard.Name,
        }).Id;
        return true;
    }
};
HuoMoShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: HuoMo.Name, description: HuoMo.Description })
], HuoMoShadow);
exports.HuoMoShadow = HuoMoShadow;
let HuoMoRecord = class HuoMoRecord extends skill_1.TriggerSkill {
    isAutoTrigger() {
        return true;
    }
    isFlaggedSkill() {
        return true;
    }
    get Muted() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "BeforeCardUseEffect" /* BeforeCardUseEffect */ || stage === "PhaseChanged" /* PhaseChanged */;
    }
    canUse(room, owner, content) {
        const identifier = event_packer_1.EventPacker.getIdentifier(content);
        if (identifier === 124 /* CardUseEvent */) {
            const cardUseEvent = content;
            return cardUseEvent.fromId === owner.Id && engine_1.Sanguosha.getCardById(cardUseEvent.cardId).is(0 /* Basic */);
        }
        else if (identifier === 104 /* PhaseChangeEvent */) {
            const phaseChangeEvent = content;
            return (phaseChangeEvent.from === 7 /* PhaseFinish */ && owner.getFlag(this.GeneralName) !== undefined);
        }
        return false;
    }
    async onTrigger(room, event) {
        event.translationsMessage = undefined;
        return true;
    }
    async onEffect(room, event) {
        const { triggeredOnEvent, fromId } = event;
        const unknownEvent = triggeredOnEvent;
        const identifier = event_packer_1.EventPacker.getIdentifier(unknownEvent);
        if (identifier === 124 /* CardUseEvent */) {
            const cardId = event.triggeredOnEvent.cardId;
            const usedCards = room.getFlag(fromId, this.GeneralName) || [];
            if (!usedCards.includes(engine_1.Sanguosha.getCardById(cardId).GeneralName)) {
                const slashName = engine_1.Sanguosha.getCardById(cardId).GeneralName;
                if (slashName === 'slash') {
                    usedCards.push('slash', 'thunder_slash', 'fire_slash');
                }
                else {
                    usedCards.push(engine_1.Sanguosha.getCardById(cardId).GeneralName);
                }
                room.setFlag(fromId, this.GeneralName, usedCards);
            }
        }
        else {
            room.removeFlag(fromId, this.GeneralName);
        }
        return true;
    }
};
HuoMoRecord = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.CommonSkill({ name: HuoMoShadow.Name, description: HuoMoShadow.Description })
], HuoMoRecord);
exports.HuoMoRecord = HuoMoRecord;
