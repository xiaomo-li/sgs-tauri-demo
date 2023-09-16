"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiJun = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let LiJun = class LiJun extends skill_1.TriggerSkill {
    isAutoTrigger() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "CardUseFinishedEffect" /* CardUseFinishedEffect */;
    }
    canUse(room, owner, content) {
        const from = room.getPlayerById(content.fromId);
        return (from !== owner &&
            !from.Dead &&
            from.Nationality === 2 /* Wu */ &&
            engine_1.Sanguosha.getCardById(content.cardId).GeneralName === 'slash' &&
            room.isCardOnProcessing(content.cardId));
    }
    async beforeUse(room, event) {
        const { fromId, triggeredOnEvent } = event;
        const cardUseEvent = triggeredOnEvent;
        const { selectedOption } = await room.doAskForCommonly(168 /* AskForChoosingOptionsEvent */, {
            toId: cardUseEvent.fromId,
            options: ['yes', 'no'],
            conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to give {1} to {2}?', this.Name, translation_json_tool_1.TranslationPack.patchCardInTranslation(cardUseEvent.cardId), translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(fromId))).extract(),
        }, cardUseEvent.fromId, true);
        if (selectedOption === 'yes') {
            return true;
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, triggeredOnEvent } = event;
        const cardUseEvent = triggeredOnEvent;
        const user = cardUseEvent.fromId;
        if (room.isCardOnProcessing(cardUseEvent.cardId)) {
            await room.moveCards({
                movingCards: [{ card: cardUseEvent.cardId, fromArea: 6 /* ProcessingArea */ }],
                toId: fromId,
                toArea: 0 /* HandArea */,
                moveReason: 2 /* ActiveMove */,
                proposer: user,
                triggeredBySkills: [this.Name],
            });
        }
        const { selectedOption } = await room.doAskForCommonly(168 /* AskForChoosingOptionsEvent */, {
            toId: fromId,
            options: ['yes', 'no'],
            conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to let {1} draws a card?', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(user))).extract(),
        }, fromId, true);
        if (selectedOption === 'yes') {
            await room.drawCards(1, user, 'top', fromId, this.Name);
        }
        return true;
    }
};
LiJun = tslib_1.__decorate([
    skill_1.LordSkill,
    skill_1.CommonSkill({ name: 'lijun', description: 'lijun_description' })
], LiJun);
exports.LiJun = LiJun;
