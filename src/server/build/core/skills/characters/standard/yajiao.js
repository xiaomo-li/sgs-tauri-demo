"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YaJiao = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let YaJiao = class YaJiao extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return (stage === "AfterCardMoved" /* AfterCardMoved */ &&
            event.infos.find(info => info.movingCards.find(cardInfo => cardInfo.fromArea === 0 /* HandArea */) !== undefined &&
                [9 /* CardResponse */, 8 /* CardUse */].includes(info.moveReason)) !== undefined);
    }
    canUse(room, owner, content) {
        return content.infos.find(info => owner.Id === info.fromId) !== undefined && room.CurrentPlayer.Id !== owner.Id;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const { fromId, triggeredOnEvent } = skillUseEvent;
        const cardUseOrResponseEvent = triggeredOnEvent;
        const card = room.getCards(1, 'top');
        const cardDisplayEvent = {
            fromId,
            displayCards: card,
            translationsMessage: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} displayed cards {1} from top of draw stack', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(fromId)), translation_json_tool_1.TranslationPack.patchCardInTranslation(...card)).extract(),
        };
        room.broadcast(126 /* CardDisplayEvent */, cardDisplayEvent);
        const lostCard = engine_1.Sanguosha.getCardById(cardUseOrResponseEvent.infos[0].movingCards[0].card);
        const obtainedCard = engine_1.Sanguosha.getCardById(card[0]);
        const sameType = lostCard.BaseType === obtainedCard.BaseType;
        const from = room.getPlayerById(fromId);
        const targets = room.AlivePlayers.filter(player => room.withinAttackDistance(player, from) && player.getCardIds().length > 0).map(p => p.Id);
        if (!sameType && targets.length < 1) {
            await room.moveCards({
                movingCards: card.map(card => ({ card })),
                moveReason: 6 /* PlaceToDropStack */,
                toArea: 4 /* DropStack */,
                hideBroadcast: true,
                movedByReason: this.Name,
            });
            return false;
        }
        const choosePlayerEvent = {
            players: sameType ? room.AlivePlayers.map(p => p.Id) : targets,
            requiredAmount: 1,
            conversation: sameType
                ? translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose a player to obtain {1}', this.Name, translation_json_tool_1.TranslationPack.patchCardInTranslation(card[0])).extract()
                : translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose a player to drop', this.Name).extract(),
            toId: fromId,
            triggeredBySkills: [this.Name],
        };
        room.notify(167 /* AskForChoosingPlayerEvent */, event_packer_1.EventPacker.createIdentifierEvent(167 /* AskForChoosingPlayerEvent */, choosePlayerEvent), fromId);
        const { selectedPlayers } = await room.onReceivingAsyncResponseFrom(167 /* AskForChoosingPlayerEvent */, fromId);
        if (selectedPlayers && selectedPlayers.length === 1) {
            if (sameType) {
                await room.moveCards({
                    movingCards: card.map(cardId => ({ card: cardId, fromArea: 6 /* ProcessingArea */ })),
                    proposer: fromId,
                    toId: selectedPlayers[0],
                    toArea: 0 /* HandArea */,
                    moveReason: 2 /* ActiveMove */,
                    movedByReason: this.Name,
                });
            }
            else {
                const to = room.getPlayerById(selectedPlayers[0]);
                if (to.getCardIds().length === 0) {
                    return false;
                }
                const options = {
                    [2 /* JudgeArea */]: to.getCardIds(2 /* JudgeArea */),
                    [1 /* EquipArea */]: to.getCardIds(1 /* EquipArea */),
                    [0 /* HandArea */]: to.getCardIds(0 /* HandArea */).length,
                };
                const chooseCardEvent = {
                    fromId,
                    toId: to.Id,
                    options,
                    triggeredBySkills: [this.Name],
                };
                room.notify(170 /* AskForChoosingCardFromPlayerEvent */, event_packer_1.EventPacker.createUncancellableEvent(chooseCardEvent), fromId);
                const response = await room.onReceivingAsyncResponseFrom(170 /* AskForChoosingCardFromPlayerEvent */, fromId);
                if (response.selectedCard === undefined) {
                    const cardIds = to.getCardIds(0 /* HandArea */);
                    response.selectedCard = cardIds[Math.floor(Math.random() * cardIds.length)];
                }
                await room.dropCards(5 /* PassiveDrop */, [response.selectedCard], chooseCardEvent.toId, chooseCardEvent.fromId, this.Name);
                await room.moveCards({
                    movingCards: card.map(card => ({ card })),
                    moveReason: 6 /* PlaceToDropStack */,
                    toArea: 4 /* DropStack */,
                    hideBroadcast: true,
                    movedByReason: this.Name,
                });
            }
        }
        else {
            await room.moveCards({
                movingCards: card.map(card => ({ card })),
                moveReason: 6 /* PlaceToDropStack */,
                toArea: 4 /* DropStack */,
                hideBroadcast: true,
                movedByReason: this.Name,
            });
        }
        return true;
    }
};
YaJiao = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'yajiao', description: 'yajiao_description' })
], YaJiao);
exports.YaJiao = YaJiao;
