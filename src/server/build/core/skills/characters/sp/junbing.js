"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JunBing = void 0;
const tslib_1 = require("tslib");
const algorithm_1 = require("core/shares/libs/algorithm");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let JunBing = class JunBing extends skill_1.TriggerSkill {
    isAutoTrigger(room, owner, event) {
        return event !== undefined && event.playerId !== owner.Id;
    }
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        return (content.toStage === 19 /* FinishStageStart */ &&
            room.getPlayerById(content.playerId).getCardIds(0 /* HandArea */).length <= 1 &&
            !room.getPlayerById(content.playerId).Dead);
    }
    async beforeUse(room, event) {
        const currentPlayer = event.triggeredOnEvent
            .playerId;
        if (currentPlayer !== event.fromId) {
            const { selectedOption } = await room.doAskForCommonly(168 /* AskForChoosingOptionsEvent */, {
                toId: currentPlayer,
                options: ['yes', 'no'],
                conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to draw a card, and then give all your hand cards to {1} ?', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(event.fromId))).extract(),
            }, currentPlayer, true);
            if (selectedOption !== 'yes') {
                return false;
            }
        }
        return true;
    }
    getSkillLog() {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to draw a card?', this.Name).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const currentPlayer = event.triggeredOnEvent
            .playerId;
        await room.drawCards(1, currentPlayer, 'top', currentPlayer, this.Name);
        const handCards = room.getPlayerById(currentPlayer).getCardIds(0 /* HandArea */).slice();
        if (currentPlayer !== event.fromId && handCards.length > 0) {
            await room.moveCards({
                movingCards: handCards.map(card => ({ card, fromArea: 0 /* HandArea */ })),
                fromId: currentPlayer,
                toId: event.fromId,
                toArea: 0 /* HandArea */,
                moveReason: 2 /* ActiveMove */,
                proposer: currentPlayer,
                triggeredBySkills: [this.Name],
            });
            let toGive = room.getPlayerById(event.fromId).getPlayerCards();
            if (toGive.length > handCards.length) {
                const { selectedCards } = await room.doAskForCommonly(163 /* AskForCardEvent */, {
                    cardAmount: handCards.length,
                    toId: event.fromId,
                    reason: this.Name,
                    conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please give {1} {2} card(s)', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(currentPlayer)), handCards.length).extract(),
                    fromArea: [0 /* HandArea */, 1 /* EquipArea */],
                    triggeredBySkills: [this.Name],
                }, event.fromId, true);
                toGive =
                    selectedCards.length === handCards.length ? selectedCards : algorithm_1.Algorithm.randomPick(handCards.length, toGive);
            }
            toGive.length > 0 &&
                (await room.moveCards({
                    movingCards: toGive.map(card => ({ card, fromArea: room.getPlayerById(event.fromId).cardFrom(card) })),
                    fromId: event.fromId,
                    toId: currentPlayer,
                    toArea: 0 /* HandArea */,
                    moveReason: 2 /* ActiveMove */,
                    proposer: event.fromId,
                    triggeredBySkills: [this.Name],
                }));
        }
        return true;
    }
};
JunBing = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'junbing', description: 'junbing_description' })
], JunBing);
exports.JunBing = JunBing;
