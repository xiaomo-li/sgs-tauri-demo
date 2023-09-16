"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FuNanEX = exports.FuNan = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let FuNan = class FuNan extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "CardUsing" /* CardUsing */ || stage === "CardResponsing" /* CardResponsing */;
    }
    canUse(room, owner, content) {
        if (content.fromId === owner.Id ||
            !content.responseToEvent ||
            event_packer_1.EventPacker.getIdentifier(content.responseToEvent) !== 125 /* CardEffectEvent */ ||
            room.getPlayerById(content.fromId).Dead) {
            return false;
        }
        const responseToEvent = content.responseToEvent;
        return responseToEvent.fromId === owner.Id && room.isCardOnProcessing(responseToEvent.cardId);
    }
    getSkillLog(room, owner, event) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to let {1} gain {2}, then you gain {3}?', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(event.fromId)), translation_json_tool_1.TranslationPack.patchCardInTranslation(event.responseToEvent.cardId), translation_json_tool_1.TranslationPack.patchCardInTranslation(event.cardId)).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const cardUseOrResponseEvent = event.triggeredOnEvent;
        await room.moveCards({
            movingCards: [
                {
                    card: cardUseOrResponseEvent.responseToEvent
                        .cardId,
                    fromArea: 6 /* ProcessingArea */,
                },
            ],
            toId: cardUseOrResponseEvent.fromId,
            toArea: 0 /* HandArea */,
            moveReason: 1 /* ActivePrey */,
            proposer: cardUseOrResponseEvent.fromId,
            triggeredBySkills: [this.Name],
        });
        room.isCardOnProcessing(cardUseOrResponseEvent.cardId) &&
            (await room.moveCards({
                movingCards: [{ card: cardUseOrResponseEvent.cardId, fromArea: 6 /* ProcessingArea */ }],
                toId: event.fromId,
                toArea: 0 /* HandArea */,
                moveReason: 1 /* ActivePrey */,
                proposer: event.fromId,
                triggeredBySkills: [this.Name],
            }));
        return true;
    }
};
FuNan = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'funan', description: 'funan_description' })
], FuNan);
exports.FuNan = FuNan;
let FuNanEX = class FuNanEX extends FuNan {
    get GeneralName() {
        return FuNan.Name;
    }
    canUse(room, owner, content) {
        if (content.fromId === owner.Id ||
            !content.responseToEvent ||
            event_packer_1.EventPacker.getIdentifier(content.responseToEvent) !== 125 /* CardEffectEvent */) {
            return false;
        }
        const responseToEvent = content.responseToEvent;
        return responseToEvent.fromId === owner.Id;
    }
    getSkillLog(room, owner, event) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to gain {1}?', this.Name, translation_json_tool_1.TranslationPack.patchCardInTranslation(event.cardId)).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const cardUseOrResponseEvent = event.triggeredOnEvent;
        room.isCardOnProcessing(cardUseOrResponseEvent.cardId) &&
            (await room.moveCards({
                movingCards: [{ card: cardUseOrResponseEvent.cardId, fromArea: 6 /* ProcessingArea */ }],
                toId: event.fromId,
                toArea: 0 /* HandArea */,
                moveReason: 1 /* ActivePrey */,
                proposer: event.fromId,
                triggeredBySkills: [this.Name],
            }));
        return true;
    }
};
FuNanEX = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'funan_EX', description: 'funan_ex_description' })
], FuNanEX);
exports.FuNanEX = FuNanEX;
