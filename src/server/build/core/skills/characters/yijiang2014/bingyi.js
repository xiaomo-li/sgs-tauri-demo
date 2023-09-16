"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BingYi = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let BingYi = class BingYi extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        return (owner.Id === content.playerId &&
            19 /* FinishStageStart */ === content.toStage &&
            owner.getCardIds(0 /* HandArea */).length > 0);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const from = room.getPlayerById(skillUseEvent.fromId);
        const handCards = from.getCardIds(0 /* HandArea */).slice();
        room.broadcast(126 /* CardDisplayEvent */, {
            fromId: skillUseEvent.fromId,
            displayCards: handCards,
            translationsMessage: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} display hand card {1}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(from), translation_json_tool_1.TranslationPack.patchCardInTranslation(...handCards)).extract(),
        });
        const firstCardColor = engine_1.Sanguosha.getCardById(handCards[0]).Color;
        const isSameColor = handCards.every(cardId => engine_1.Sanguosha.getCardById(cardId).Color === firstCardColor);
        if (isSameColor) {
            const askForPlayerChoose = {
                players: room.AlivePlayers.map(player => player.Id),
                toId: from.Id,
                requiredAmount: [1, handCards.length],
                conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('please choose less than {0} player to draw 1 crad.', handCards.length).extract(),
                triggeredBySkills: [this.Name],
            };
            room.notify(167 /* AskForChoosingPlayerEvent */, event_packer_1.EventPacker.createUncancellableEvent(askForPlayerChoose), from.Id);
            const { selectedPlayers } = await room.onReceivingAsyncResponseFrom(167 /* AskForChoosingPlayerEvent */, from.Id);
            if (selectedPlayers !== undefined) {
                for (const playerId of selectedPlayers) {
                    await room.drawCards(1, playerId, 'top', from.Id, this.Name);
                }
            }
        }
        handCards.every(cardId => engine_1.Sanguosha.getCardById(cardId).CardNumber === engine_1.Sanguosha.getCardById(handCards[0]).CardNumber) && (await room.drawCards(1, from.Id, 'top', from.Id, this.Name));
        return true;
    }
};
BingYi = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'bingyi', description: 'bingyi_description' })
], BingYi);
exports.BingYi = BingYi;
