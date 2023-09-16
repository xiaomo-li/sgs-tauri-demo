"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WuShuangShadow = exports.WuShuang = void 0;
const tslib_1 = require("tslib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let WuShuang = class WuShuang extends skill_1.TriggerSkill {
    get RelatedCharacters() {
        return ['lvlingqi'];
    }
    isTriggerable(event, stage) {
        if (stage === "AfterAim" /* AfterAim */) {
            return (event.byCardId !== undefined &&
                (engine_1.Sanguosha.getCardById(event.byCardId).GeneralName === 'slash' ||
                    engine_1.Sanguosha.getCardById(event.byCardId).GeneralName === 'duel'));
        }
        else if (stage === "AfterAimmed" /* AfterAimmed */) {
            return event.byCardId !== undefined && engine_1.Sanguosha.getCardById(event.byCardId).GeneralName === 'duel';
        }
        return false;
    }
    canUse(room, owner, event) {
        if (event_packer_1.EventPacker.getMiddleware(this.Name, event)) {
            return false;
        }
        if (engine_1.Sanguosha.getCardById(event.byCardId).GeneralName === 'slash') {
            return owner.Id === event.fromId;
        }
        return owner.Id === event.fromId || event.toId === owner.Id;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const { triggeredOnEvent } = skillUseEvent;
        const wushuangEvent = triggeredOnEvent;
        event_packer_1.EventPacker.addMiddleware({
            tag: this.Name,
            data: true,
        }, wushuangEvent);
        return true;
    }
};
WuShuang = tslib_1.__decorate([
    skill_1.CompulsorySkill({ name: 'wushuang', description: 'wushuang_description' })
], WuShuang);
exports.WuShuang = WuShuang;
let WuShuangShadow = class WuShuangShadow extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterCardUseEffect" /* AfterCardUseEffect */ || stage === "AfterCardResponseEffect" /* AfterCardResponseEffect */;
    }
    canUse(room, owner, event) {
        const identifier = event_packer_1.EventPacker.getIdentifier(event);
        const { responseToEvent } = event;
        if (!responseToEvent) {
            return false;
        }
        let canUse = false;
        switch (identifier) {
            case 124 /* CardUseEvent */: {
                const jinkEvent = event;
                const { responseToEvent } = jinkEvent;
                const slashEvent = responseToEvent;
                canUse =
                    jinkEvent.toCardIds !== undefined &&
                        engine_1.Sanguosha.getCardById(jinkEvent.cardId).GeneralName === 'jink' &&
                        slashEvent &&
                        engine_1.Sanguosha.getCardById(slashEvent.cardId).GeneralName === 'slash' &&
                        !event_packer_1.EventPacker.getMiddleware(this.Name, jinkEvent);
                break;
            }
            case 123 /* CardResponseEvent */: {
                const slashEvent = event;
                const { responseToEvent } = slashEvent;
                const duelEvent = responseToEvent;
                canUse = engine_1.Sanguosha.getCardById(duelEvent.cardId).GeneralName === 'duel' && slashEvent.fromId !== owner.Id;
                break;
            }
            default:
                return false;
        }
        return canUse && !!event_packer_1.EventPacker.getMiddleware(this.GeneralName, responseToEvent);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const { triggeredOnEvent } = skillUseEvent;
        const unknownEvent = triggeredOnEvent;
        const identifier = event_packer_1.EventPacker.getIdentifier(unknownEvent);
        if (identifier === 124 /* CardUseEvent */) {
            const jinkEvent = unknownEvent;
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
                if (!event_packer_1.EventPacker.terminate(useJinkEvent) || useJinkEvent.toCardIds) {
                    event_packer_1.EventPacker.recall(jinkEvent);
                }
            }
        }
        else {
            const duelResponseEvent = unknownEvent;
            if (event_packer_1.EventPacker.getMiddleware(this.Name, duelResponseEvent)) {
                return true;
            }
            const { responseToEvent } = duelResponseEvent;
            const duelEvent = responseToEvent;
            const askForResponseCardEvent = {
                toId: duelResponseEvent.fromId,
                cardMatcher: new card_matcher_1.CardMatcher({ generalName: ['slash'] }).toSocketPassenger(),
                byCardId: duelEvent.cardId,
                cardUserId: duelResponseEvent.fromId,
                conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('please response a {0} card to response {1}', 'slash', translation_json_tool_1.TranslationPack.patchCardInTranslation(duelEvent.cardId)).extract(),
                triggeredBySkills: [this.Name],
            };
            const response = await room.askForCardResponse(askForResponseCardEvent, duelResponseEvent.fromId);
            if (response.cardId === undefined) {
                event_packer_1.EventPacker.terminate(duelResponseEvent);
            }
            else {
                const responseCardEvent = {
                    fromId: duelResponseEvent.fromId,
                    cardId: response.cardId,
                    responseToEvent: duelEvent,
                };
                event_packer_1.EventPacker.addMiddleware({ tag: this.Name, data: true }, responseCardEvent);
                await room.responseCard(responseCardEvent);
            }
        }
        return true;
    }
};
WuShuangShadow = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.CompulsorySkill({ name: WuShuang.GeneralName, description: WuShuang.Description })
], WuShuangShadow);
exports.WuShuangShadow = WuShuangShadow;
