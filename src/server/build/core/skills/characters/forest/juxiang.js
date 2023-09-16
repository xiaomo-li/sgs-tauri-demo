"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JuXiang = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let JuXiang = class JuXiang extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "PreCardEffect" /* PreCardEffect */ || stage === "CardUseFinishedEffect" /* CardUseFinishedEffect */;
    }
    canUse(room, owner, event) {
        const unknownEvent = event_packer_1.EventPacker.getIdentifier(event);
        if (unknownEvent === 125 /* CardEffectEvent */) {
            const cardEffectEvent = event;
            return (cardEffectEvent.toIds !== undefined &&
                cardEffectEvent.toIds.includes(owner.Id) &&
                engine_1.Sanguosha.getCardById(cardEffectEvent.cardId).GeneralName === 'nanmanruqing');
        }
        else if (unknownEvent === 124 /* CardUseEvent */) {
            const cardUseEvent = event;
            return (engine_1.Sanguosha.getCardById(cardUseEvent.cardId).GeneralName === 'nanmanruqing' &&
                cardUseEvent.fromId !== owner.Id &&
                room.isCardOnProcessing(cardUseEvent.cardId));
        }
        return false;
    }
    async onTrigger(room, content) {
        const unknownEvent = content.triggeredOnEvent;
        const identifier = event_packer_1.EventPacker.getIdentifier(unknownEvent);
        if (identifier === 125 /* CardEffectEvent */) {
            const cardEffectEvent = unknownEvent;
            content.translationsMessage = translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} triggered skill {1}, nullify {2}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(content.fromId)), this.Name, translation_json_tool_1.TranslationPack.patchCardInTranslation(cardEffectEvent.cardId)).extract();
        }
        else if (identifier === 124 /* CardUseEvent */) {
            content.translationsMessage = translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} triggered skill {1}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(content.fromId)), this.Name).extract();
        }
        return true;
    }
    async onEffect(room, event) {
        var _a;
        const unknownEvent = event.triggeredOnEvent;
        const identifier = event_packer_1.EventPacker.getIdentifier(unknownEvent);
        if (identifier === 125 /* CardEffectEvent */) {
            const cardEffectEvent = unknownEvent;
            (_a = cardEffectEvent.nullifiedTargets) === null || _a === void 0 ? void 0 : _a.push(event.fromId);
        }
        else if (identifier === 124 /* CardUseEvent */) {
            const cardUseEvent = unknownEvent;
            const { cardId } = cardUseEvent;
            const cardIds = [];
            cardIds.push(cardId);
            await room.moveCards({
                movingCards: cardIds.map(card => ({ card, fromArea: 6 /* ProcessingArea */ })),
                toId: event.fromId,
                moveReason: 1 /* ActivePrey */,
                toArea: 0 /* HandArea */,
            });
        }
        return true;
    }
};
JuXiang = tslib_1.__decorate([
    skill_1.CompulsorySkill({ name: 'juxiang', description: 'juxiang_description' })
], JuXiang);
exports.JuXiang = JuXiang;
