"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TianMing = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let TianMing = class TianMing extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterAimmed" /* AfterAimmed */;
    }
    canUse(room, owner, event) {
        return event.toId === owner.Id && engine_1.Sanguosha.getCardById(event.byCardId).GeneralName === 'slash';
    }
    cardFilter(room, owner, cards) {
        return cards.length === (owner.getPlayerCards().filter(id => room.canDropCard(owner.Id, id)).length > 2 ? 2 : 0);
    }
    isAvailableCard(owner, room, cardId) {
        return room.canDropCard(owner, cardId);
    }
    getSkillLog(room, owner) {
        const canDropCards = owner.getPlayerCards().filter(id => room.canDropCard(owner.Id, id));
        return canDropCards.length > 0
            ? canDropCards.length <= 2
                ? translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to discard {1} card(s) to draw 2 cards?', this.Name, translation_json_tool_1.TranslationPack.patchCardInTranslation(...canDropCards)).extract()
                : translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to discard 2 cards to draw 2 cards?', this.Name).extract()
            : translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to draw 2 cards?', this.Name).extract();
    }
    async onTrigger(room, event) {
        event.cardIds =
            event.cardIds && event.cardIds.length > 0
                ? event.cardIds
                : room
                    .getPlayerById(event.fromId)
                    .getPlayerCards()
                    .filter(id => room.canDropCard(event.fromId, id));
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        if (!event.cardIds) {
            return false;
        }
        event.cardIds.length > 0 &&
            (await room.dropCards(4 /* SelfDrop */, event.cardIds, fromId, fromId, this.Name));
        await room.drawCards(2, fromId, 'top', fromId, this.Name);
        let richest = room.getPlayerById(fromId);
        for (const player of room.getOtherPlayers(fromId)) {
            player.getCardIds(0 /* HandArea */).length > richest.getCardIds(0 /* HandArea */).length &&
                (richest = player);
        }
        if (richest.Id !== fromId &&
            !room
                .getOtherPlayers(richest.Id)
                .find(player => player.getCardIds(0 /* HandArea */).length === richest.getCardIds(0 /* HandArea */).length)) {
            const canDropCards = richest.getPlayerCards().filter(id => room.canDropCard(richest.Id, id));
            const canDropNum = Math.min(canDropCards.length, 2);
            room.notify(171 /* AskForSkillUseEvent */, {
                invokeSkillNames: [this.Name],
                toId: richest.Id,
                conversation: canDropNum > 0
                    ? translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to discard {1} card(s) to draw 2 cards?', this.Name, canDropNum).extract()
                    : translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to draw 2 cards?', this.Name).extract(),
            }, richest.Id);
            const resp = await room.onReceivingAsyncResponseFrom(171 /* AskForSkillUseEvent */, richest.Id);
            if (resp.cardIds) {
                const toDiscard = resp.cardIds.length > 0 ? resp.cardIds : canDropCards;
                toDiscard.length > 0 &&
                    (await room.dropCards(4 /* SelfDrop */, toDiscard, richest.Id, richest.Id, this.Name));
                await room.drawCards(2, richest.Id, 'top', richest.Id, this.Name);
            }
        }
        return true;
    }
};
TianMing = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'tianming', description: 'tianming_description' })
], TianMing);
exports.TianMing = TianMing;
