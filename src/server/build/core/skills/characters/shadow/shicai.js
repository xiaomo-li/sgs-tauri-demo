"use strict";
var ShiCai_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShiCaiShadow = exports.ShiCai = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let ShiCai = ShiCai_1 = class ShiCai extends skill_1.TriggerSkill {
    async whenObtainingSkill(room, owner) {
        const shicaiUsed = owner.getFlag(this.Name) || [];
        const cardUseEvents = room.Analytics.getCardUseRecord(owner.Id, 'round');
        if (cardUseEvents.length > 0) {
            for (const event of cardUseEvents) {
                if (shicaiUsed.length === 3) {
                    break;
                }
                const type = engine_1.Sanguosha.getCardById(event.cardId).BaseType;
                if (!shicaiUsed.includes(type)) {
                    shicaiUsed.push(type);
                }
            }
            shicaiUsed.length > 0 && owner.setFlag(this.Name, shicaiUsed);
        }
    }
    isTriggerable(event, stage) {
        return stage === "CardUseFinishedEffect" /* CardUseFinishedEffect */ || stage === "AfterAimmed" /* AfterAimmed */;
    }
    canUse(room, owner, content) {
        const identifier = event_packer_1.EventPacker.getIdentifier(content);
        if (identifier === 124 /* CardUseEvent */) {
            const cardUseEvent = content;
            const card = engine_1.Sanguosha.getCardById(cardUseEvent.cardId);
            const cardIds = card.isVirtualCard() ? card.getRealActualCards() : [cardUseEvent.cardId];
            return (cardUseEvent.fromId === owner.Id &&
                cardIds.length > 0 &&
                !(card.is(1 /* Equip */) || card.is(8 /* DelayedTrick */)) &&
                room.isCardOnProcessing(cardUseEvent.cardId) &&
                event_packer_1.EventPacker.getMiddleware(ShiCai_1.ShiCaiTypeUsed, cardUseEvent) === true);
        }
        else if (identifier === 131 /* AimEvent */) {
            const aimEvent = content;
            if (!aimEvent.byCardId) {
                return false;
            }
            const card = engine_1.Sanguosha.getCardById(aimEvent.byCardId);
            const cardIds = card.isVirtualCard() ? card.getRealActualCards() : [aimEvent.byCardId];
            return (aimEvent.fromId === owner.Id &&
                cardIds.length > 0 &&
                card.is(1 /* Equip */) &&
                room.isCardOnProcessing(aimEvent.byCardId) &&
                event_packer_1.EventPacker.getMiddleware(ShiCai_1.ShiCaiTypeUsed, aimEvent) === true);
        }
        return false;
    }
    getSkillLog(room, owner, event) {
        const judge = event_packer_1.EventPacker.getIdentifier(event) === 124 /* CardUseEvent */;
        const card = judge
            ? event.cardId
            : event.byCardId;
        return card
            ? translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to put {1} on the top of draw stack, then draw a card?', this.Name, translation_json_tool_1.TranslationPack.patchCardInTranslation(card)).extract()
            : translation_json_tool_1.TranslationPack.translationJsonPatcher('do you want to trigger skill {0} ?', this.Name).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, triggeredOnEvent } = event;
        const unknownEvent = triggeredOnEvent;
        const identifier = event_packer_1.EventPacker.getIdentifier(unknownEvent);
        let cardIds = [];
        let mainCard;
        if (identifier === 124 /* CardUseEvent */) {
            const cardUseEvent = unknownEvent;
            const card = engine_1.Sanguosha.getCardById(cardUseEvent.cardId);
            cardIds = card.isVirtualCard() ? card.getRealActualCards() : [cardUseEvent.cardId];
            mainCard = cardUseEvent.cardId;
        }
        else {
            const aimEvent = unknownEvent;
            if (!aimEvent.byCardId) {
                return false;
            }
            const card = engine_1.Sanguosha.getCardById(aimEvent.byCardId);
            cardIds = card.isVirtualCard() ? card.getRealActualCards() : [aimEvent.byCardId];
            mainCard = aimEvent.byCardId;
        }
        let toMove = cardIds;
        if (cardIds.length > 1) {
            const { top } = await room.doAskForCommonly(172 /* AskForPlaceCardsInDileEvent */, event_packer_1.EventPacker.createUncancellableEvent({
                cardIds,
                top: cardIds.length,
                topStackName: 'draw stack top',
                bottom: 0,
                bottomStackName: 'draw stack bottom',
                toId: fromId,
                movable: true,
                triggeredBySkills: [this.Name],
            }), fromId);
            toMove = top;
        }
        await room.moveCards({
            movingCards: toMove.map(card => ({ card, fromArea: 6 /* ProcessingArea */ })),
            toArea: 5 /* DrawStack */,
            moveReason: 7 /* PlaceToDrawStack */,
        });
        room.endProcessOnTag(mainCard.toString());
        await room.drawCards(1, fromId, 'top', fromId, this.Name);
        return true;
    }
};
ShiCai.ShiCaiTypeUsed = 'shicai_type_used';
ShiCai = ShiCai_1 = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'shicai', description: 'shicai_description' })
], ShiCai);
exports.ShiCai = ShiCai;
let ShiCaiShadow = class ShiCaiShadow extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    getPriority() {
        return 0 /* High */;
    }
    isAutoTrigger() {
        return true;
    }
    isFlaggedSkill() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "BeforeCardUseEffect" /* BeforeCardUseEffect */ || stage === "PhaseChanged" /* PhaseChanged */;
    }
    canUse(room, owner, event) {
        const identifier = event_packer_1.EventPacker.getIdentifier(event);
        const flag = owner.getFlag(this.GeneralName);
        if (identifier === 124 /* CardUseEvent */) {
            const cardUseEvent = event;
            const shicaiUsed = flag || [];
            return (cardUseEvent.fromId === owner.Id && !shicaiUsed.includes(engine_1.Sanguosha.getCardById(cardUseEvent.cardId).BaseType));
        }
        else if (identifier === 104 /* PhaseChangeEvent */) {
            const phaseChangeEvent = event;
            return flag && phaseChangeEvent.from === 7 /* PhaseFinish */;
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, triggeredOnEvent } = event;
        const unknownEvent = triggeredOnEvent;
        const identifier = event_packer_1.EventPacker.getIdentifier(unknownEvent);
        if (identifier === 124 /* CardUseEvent */) {
            const cardUseEvent = unknownEvent;
            const from = room.getPlayerById(fromId);
            const shicaiUsed = from.getFlag(this.GeneralName) || [];
            from.setFlag(this.GeneralName, [...shicaiUsed, engine_1.Sanguosha.getCardById(cardUseEvent.cardId).BaseType]);
            event_packer_1.EventPacker.addMiddleware({ tag: ShiCai.ShiCaiTypeUsed, data: true }, cardUseEvent);
        }
        else {
            room.removeFlag(event.fromId, this.GeneralName);
        }
        return true;
    }
};
ShiCaiShadow = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.PersistentSkill(),
    skill_1.CommonSkill({ name: ShiCai.Name, description: ShiCai.Description })
], ShiCaiShadow);
exports.ShiCaiShadow = ShiCaiShadow;
