"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouLinShadow = exports.RouLin = void 0;
const tslib_1 = require("tslib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let RouLin = class RouLin extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        if (stage === "AfterAim" /* AfterAim */) {
            return event.byCardId !== undefined && engine_1.Sanguosha.getCardById(event.byCardId).GeneralName === 'slash';
        }
        else if (stage === "AfterAimmed" /* AfterAimmed */) {
            return event.byCardId !== undefined && engine_1.Sanguosha.getCardById(event.byCardId).GeneralName === 'slash';
        }
        return false;
    }
    canUse(room, owner, event) {
        if (event_packer_1.EventPacker.getMiddleware(this.Name, event)) {
            return false;
        }
        return ((owner.Id === event.fromId && room.getPlayerById(event.toId).Gender === 1 /* Female */) ||
            (owner.Id === event.toId && room.getPlayerById(event.fromId).Gender === 1 /* Female */));
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const { triggeredOnEvent } = skillUseEvent;
        const rouLinEvent = triggeredOnEvent;
        event_packer_1.EventPacker.addMiddleware({
            tag: this.Name,
            data: true,
        }, rouLinEvent);
        return true;
    }
};
RouLin = tslib_1.__decorate([
    skill_1.CompulsorySkill({ name: 'roulin', description: 'roulin_description' })
], RouLin);
exports.RouLin = RouLin;
let RouLinShadow = class RouLinShadow extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 0 /* PhaseBegin */ && stage === "AfterPhaseChanged" /* AfterPhaseChanged */;
    }
    isTriggerable(event, stage) {
        return stage === "AfterCardUseEffect" /* AfterCardUseEffect */;
    }
    canUse(room, owner, event) {
        if (!event.responseToEvent) {
            return false;
        }
        let canUse = false;
        const { responseToEvent } = event;
        const slashEvent = responseToEvent;
        canUse =
            engine_1.Sanguosha.getCardById(event.cardId).GeneralName === 'jink' &&
                slashEvent &&
                engine_1.Sanguosha.getCardById(slashEvent.cardId).GeneralName === 'slash' &&
                !event_packer_1.EventPacker.getMiddleware(this.Name, event);
        return canUse && !!event_packer_1.EventPacker.getMiddleware(this.GeneralName, responseToEvent);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const { triggeredOnEvent } = skillUseEvent;
        const jinkEvent = triggeredOnEvent;
        const { responseToEvent } = jinkEvent;
        const slashEvent = responseToEvent;
        event_packer_1.EventPacker.removeMiddleware(this.GeneralName, slashEvent);
        event_packer_1.EventPacker.terminate(jinkEvent);
        const askForUseCardEvent = {
            toId: jinkEvent.fromId,
            cardMatcher: new card_matcher_1.CardMatcher({ name: ['jink'] }).toSocketPassenger(),
            byCardId: slashEvent.cardId,
            cardUserId: slashEvent.fromId,
            triggeredBySkills: [this.Name],
            conversation: slashEvent.fromId !== undefined
                ? translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} used {1} to you, please use a {2} card', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(slashEvent.fromId)), translation_json_tool_1.TranslationPack.patchCardInTranslation(slashEvent.cardId), 'jink').extract()
                : translation_json_tool_1.TranslationPack.translationJsonPatcher('please use a {0} card to response {1}', 'jink', translation_json_tool_1.TranslationPack.patchCardInTranslation(slashEvent.cardId)).extract(),
            triggeredOnEvent: slashEvent,
        };
        const response = await room.askForCardUse(askForUseCardEvent, jinkEvent.fromId);
        if (response.cardId !== undefined) {
            const useJinkEvent = {
                fromId: jinkEvent.fromId,
                cardId: response.cardId,
                toCardIds: jinkEvent.toCardIds,
                responseToEvent: slashEvent,
            };
            event_packer_1.EventPacker.addMiddleware({ tag: this.Name, data: true }, useJinkEvent);
            await room.useCard(useJinkEvent, true);
            if (!event_packer_1.EventPacker.isTerminated(useJinkEvent)) {
                event_packer_1.EventPacker.recall(jinkEvent);
            }
        }
        return true;
    }
};
RouLinShadow = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.CompulsorySkill({ name: RouLin.GeneralName, description: RouLin.Description })
], RouLinShadow);
exports.RouLinShadow = RouLinShadow;
