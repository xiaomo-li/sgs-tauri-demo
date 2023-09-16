"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiYu = void 0;
const tslib_1 = require("tslib");
const card_1 = require("core/cards/card");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let LiYu = class LiYu extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return (stage === "AfterDamageEffect" /* AfterDamageEffect */ &&
            !!event.cardIds &&
            event.cardIds.length === 1 &&
            engine_1.Sanguosha.getCardById(event.cardIds[0]).GeneralName === 'slash');
    }
    canUse(room, owner, content) {
        const to = room.getPlayerById(content.toId);
        const cards = to.getCardIds();
        return owner.Id === content.fromId && content.toId !== owner.Id && cards.length > 0;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const { triggeredOnEvent } = skillUseEvent;
        const damageEvent = triggeredOnEvent;
        const from = room.getPlayerById(damageEvent.fromId);
        const to = room.getPlayerById(damageEvent.toId);
        const options = {
            [2 /* JudgeArea */]: to.getCardIds(2 /* JudgeArea */),
            [1 /* EquipArea */]: to.getCardIds(1 /* EquipArea */),
            [0 /* HandArea */]: to.getCardIds(0 /* HandArea */).length,
        };
        const chooseCardEvent = {
            fromId: damageEvent.fromId,
            toId: damageEvent.toId,
            options,
            triggeredBySkills: [this.Name],
        };
        room.notify(170 /* AskForChoosingCardFromPlayerEvent */, event_packer_1.EventPacker.createUncancellableEvent(chooseCardEvent), damageEvent.fromId);
        const response = await room.onReceivingAsyncResponseFrom(170 /* AskForChoosingCardFromPlayerEvent */, damageEvent.fromId);
        if (response.selectedCard === undefined) {
            const cardIds = to.getCardIds(0 /* HandArea */);
            response.selectedCard = cardIds[Math.floor(Math.random() * cardIds.length)];
        }
        await room.moveCards({
            movingCards: [{ card: response.selectedCard, fromArea: response.fromArea }],
            fromId: chooseCardEvent.toId,
            toId: chooseCardEvent.fromId,
            toArea: 0 /* HandArea */,
            moveReason: 1 /* ActivePrey */,
            proposer: chooseCardEvent.fromId,
            movedByReason: this.Name,
            translationsMessage: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} obtains cards {1} from {2}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(chooseCardEvent.fromId)), translation_json_tool_1.TranslationPack.patchCardInTranslation(response.selectedCard), translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(chooseCardEvent.toId))).extract(),
        });
        const responseCard = engine_1.Sanguosha.getCardById(response.selectedCard);
        if (responseCard.is(1 /* Equip */)) {
            const targets = room
                .getOtherPlayers(damageEvent.fromId)
                .filter(p => p.Id !== damageEvent.toId && from.canUseCardTo(room, new card_matcher_1.CardMatcher({ name: ['duel'] }), p.Id))
                .map(p => p.Id);
            if (targets.length > 0) {
                const choosePlayerEvent = {
                    players: targets,
                    requiredAmount: 1,
                    conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('liyu: please choose a player, as target of {0} duel', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(skillUseEvent.fromId))).extract(),
                    toId: chooseCardEvent.toId,
                    triggeredBySkills: [this.Name],
                };
                room.notify(167 /* AskForChoosingPlayerEvent */, event_packer_1.EventPacker.createUncancellableEvent(choosePlayerEvent), chooseCardEvent.toId);
                const choosePlayerResponse = await room.onReceivingAsyncResponseFrom(167 /* AskForChoosingPlayerEvent */, chooseCardEvent.toId);
                const cardUseEvent = {
                    fromId: from.Id,
                    cardId: card_1.VirtualCard.create({
                        cardName: 'duel',
                        bySkill: this.Name,
                    }).Id,
                    targetGroup: [choosePlayerResponse.selectedPlayers],
                };
                await room.useCard(cardUseEvent);
            }
        }
        else {
            await room.drawCards(1, chooseCardEvent.toId, undefined, skillUseEvent.fromId, this.Name);
        }
        return true;
    }
};
LiYu = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'liyu', description: 'liyu_description' })
], LiYu);
exports.LiYu = LiYu;
