"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HuoShou = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const nanmanruqing_1 = require("core/skills/cards/standard/nanmanruqing");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let HuoShou = class HuoShou extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "PreCardEffect" /* PreCardEffect */ || stage === "AfterAim" /* AfterAim */;
    }
    canUse(room, owner, event) {
        const unknownEvent = event_packer_1.EventPacker.getIdentifier(event);
        if (unknownEvent === 125 /* CardEffectEvent */) {
            const cardEffectEvent = event;
            return (cardEffectEvent.toIds !== undefined &&
                cardEffectEvent.toIds.includes(owner.Id) &&
                engine_1.Sanguosha.getCardById(cardEffectEvent.cardId).GeneralName === 'nanmanruqing');
        }
        else if (unknownEvent === 131 /* AimEvent */) {
            const aimEvent = event;
            return (aimEvent.byCardId !== undefined &&
                engine_1.Sanguosha.getCardById(aimEvent.byCardId).GeneralName === 'nanmanruqing' &&
                aimEvent.fromId !== owner.Id &&
                aimEvent.isFirstTarget);
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
        else if (identifier === 131 /* AimEvent */) {
            const aimEvent = unknownEvent;
            content.translationsMessage = translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} triggered skill {1}, become the source of damage dealed by {2}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(content.fromId)), this.Name, translation_json_tool_1.TranslationPack.patchCardInTranslation(aimEvent.byCardId)).extract();
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
        else if (identifier === 131 /* AimEvent */) {
            const aimEvent = unknownEvent;
            event_packer_1.EventPacker.addMiddleware({
                tag: nanmanruqing_1.NanManRuQingSkill.NewSource,
                data: event.fromId,
            }, aimEvent);
        }
        return true;
    }
};
HuoShou = tslib_1.__decorate([
    skill_1.CompulsorySkill({ name: 'huoshou', description: 'huoshou_description' })
], HuoShou);
exports.HuoShou = HuoShou;
