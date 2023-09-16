"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DuanBingShadow = exports.DuanBing = void 0;
const tslib_1 = require("tslib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const target_group_1 = require("core/shares/libs/utils/target_group");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let DuanBing = class DuanBing extends skill_1.TriggerSkill {
    isAutoTrigger() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "AfterCardTargetDeclared" /* AfterCardTargetDeclared */ || stage === "AfterAim" /* AfterAim */;
    }
    canUse(room, owner, content) {
        const identifier = event_packer_1.EventPacker.getIdentifier(content);
        if (identifier === 124 /* CardUseEvent */) {
            const cardUseEvent = content;
            return cardUseEvent.fromId === owner.Id && engine_1.Sanguosha.getCardById(cardUseEvent.cardId).GeneralName === 'slash';
        }
        else if (identifier === 131 /* AimEvent */) {
            const aimEvent = content;
            return aimEvent.fromId === owner.Id && engine_1.Sanguosha.getCardById(aimEvent.byCardId).GeneralName === 'slash';
        }
        return false;
    }
    async beforeUse(room, event) {
        const unknownEvent = event.triggeredOnEvent;
        if (event_packer_1.EventPacker.getIdentifier(unknownEvent) === 124 /* CardUseEvent */) {
            const cardUseEvent = unknownEvent;
            const from = room.getPlayerById(event.fromId);
            const targets = room
                .getOtherPlayers(event.fromId)
                .filter(player => room.distanceBetween(from, player) === 1 &&
                !target_group_1.TargetGroupUtil.getRealTargets(cardUseEvent.targetGroup).includes(player.Id) &&
                room.canUseCardTo(cardUseEvent.cardId, from, player, true))
                .map(player => player.Id);
            if (targets.length < 1) {
                return false;
            }
            const response = await room.doAskForCommonly(167 /* AskForChoosingPlayerEvent */, {
                players: targets,
                toId: event.fromId,
                requiredAmount: 1,
                conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to choose a target with 1 distance between you to be the target of {1}?', this.Name, translation_json_tool_1.TranslationPack.patchCardInTranslation(cardUseEvent.cardId)).extract(),
                triggeredBySkills: [this.Name],
            }, event.fromId);
            if (response.selectedPlayers && response.selectedPlayers.length > 0) {
                event.toIds = response.selectedPlayers;
                return true;
            }
        }
        return event_packer_1.EventPacker.getIdentifier(unknownEvent) === 131 /* AimEvent */;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const unknownEvent = event.triggeredOnEvent;
        if (event_packer_1.EventPacker.getIdentifier(unknownEvent) === 124 /* CardUseEvent */) {
            if (!event.toIds) {
                return false;
            }
            target_group_1.TargetGroupUtil.pushTargets(unknownEvent.targetGroup, event.toIds[0]);
        }
        else {
            event_packer_1.EventPacker.addMiddleware({ tag: this.Name, data: true }, unknownEvent);
        }
        return true;
    }
};
DuanBing = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'duanbing', description: 'duanbing_description' })
], DuanBing);
exports.DuanBing = DuanBing;
let DuanBingShadow = class DuanBingShadow extends skill_1.TriggerSkill {
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
        return stage === "AfterCardUseEffect" /* AfterCardUseEffect */;
    }
    canUse(room, owner, event) {
        if (!event.responseToEvent) {
            return false;
        }
        const slashEvent = event.responseToEvent;
        return (event.toCardIds !== undefined &&
            !!event_packer_1.EventPacker.getMiddleware(this.GeneralName, event.responseToEvent) &&
            engine_1.Sanguosha.getCardById(event.cardId).GeneralName === 'jink' &&
            slashEvent &&
            engine_1.Sanguosha.getCardById(slashEvent.cardId).GeneralName === 'slash' &&
            !event_packer_1.EventPacker.getMiddleware(this.Name, event));
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const jinkEvent = event.triggeredOnEvent;
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
        return true;
    }
};
DuanBingShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: DuanBing.Name, description: DuanBing.Description })
], DuanBingShadow);
exports.DuanBingShadow = DuanBingShadow;
