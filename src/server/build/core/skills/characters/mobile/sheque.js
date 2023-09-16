"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SheQue = void 0;
const tslib_1 = require("tslib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let SheQue = class SheQue extends skill_1.TriggerSkill {
    isAutoTrigger() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        return (owner.Id !== content.playerId &&
            3 /* PrepareStageStart */ === content.toStage &&
            room.getPlayerById(content.playerId).getCardIds(1 /* EquipArea */).length > 0);
    }
    async beforeUse(room, event) {
        const { fromId, triggeredOnEvent } = event;
        const changeEvent = triggeredOnEvent;
        const response = await room.askForCardUse({
            toId: fromId,
            cardUserId: fromId,
            scopedTargets: [changeEvent.playerId],
            cardMatcher: new card_matcher_1.CardMatcher({ generalName: ['slash'] }).toSocketPassenger(),
            extraUse: true,
            commonUse: false,
            conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to use a slash to {1} (this slash ignores armors)?', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(changeEvent.playerId))).extract(),
            triggeredBySkills: [this.Name],
        }, fromId);
        if (response.cardId !== undefined) {
            const cardUseEvent = {
                fromId: response.fromId,
                cardId: response.cardId,
                targetGroup: [response.toIds],
                triggeredBySkills: [this.Name],
            };
            event_packer_1.EventPacker.addMiddleware({
                tag: this.Name,
                data: cardUseEvent,
            }, event);
            return true;
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const cardUseEvent = event_packer_1.EventPacker.getMiddleware(this.Name, skillUseEvent);
        if (cardUseEvent === undefined) {
            return false;
        }
        await room.useCard(cardUseEvent, true);
        return true;
    }
};
SheQue = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'sheque', description: 'sheque_description' })
], SheQue);
exports.SheQue = SheQue;
