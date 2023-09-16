"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JiuFa = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let JiuFa = class JiuFa extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterCardUseEffect" /* AfterCardUseEffect */ || stage === "AfterCardResponseEffect" /* AfterCardResponseEffect */;
    }
    canUse(room, owner, content) {
        return (content.fromId === owner.Id &&
            (!owner.getFlag(this.Name) ||
                !owner.getFlag(this.Name).includes(engine_1.Sanguosha.getCardById(content.cardId).GeneralName)));
    }
    isAutoTrigger(room, owner, event) {
        return !owner.getFlag(this.Name) || owner.getFlag(this.Name).length < 8;
    }
    async onTrigger(room, skillEffectEvent) {
        if (!room.getFlag(skillEffectEvent.fromId, this.Name) ||
            room.getFlag(skillEffectEvent.fromId, this.Name).length < 8) {
            skillEffectEvent.translationsMessage = undefined;
        }
        return true;
    }
    async onEffect(room, skillEffectEvent) {
        const event = skillEffectEvent.triggeredOnEvent;
        const flags = room.getFlag(skillEffectEvent.fromId, this.Name) || [];
        if (flags.length < 8) {
            flags.push(engine_1.Sanguosha.getCardById(event.cardId).GeneralName);
            room.setFlag(event.fromId, this.Name, flags, this.Name);
        }
        else {
            room.removeFlag(skillEffectEvent.fromId, this.Name);
            const displayCardIds = room.getCards(9, 'top');
            const selectedCardIds = displayCardIds
                .filter((cardId, _, allCardIds) => allCardIds.filter(id => engine_1.Sanguosha.getCardById(id).CardNumber === engine_1.Sanguosha.getCardById(cardId).CardNumber)
                .length === 1)
                .map(cardId => ({
                card: cardId,
            }));
            room.addProcessingCards(displayCardIds.toString(), ...displayCardIds);
            const observeCardsEvent = {
                cardIds: displayCardIds,
                selected: selectedCardIds,
            };
            room.broadcast(129 /* ObserveCardsEvent */, observeCardsEvent);
            while (selectedCardIds.length < 9) {
                const chooseJiuFaCardEvent = {
                    cardIds: displayCardIds,
                    selected: selectedCardIds,
                    toId: skillEffectEvent.fromId,
                    userId: skillEffectEvent.fromId,
                    triggeredBySkills: [this.Name],
                };
                room.notify(173 /* AskForContinuouslyChoosingCardEvent */, chooseJiuFaCardEvent, skillEffectEvent.fromId);
                const response = await room.onReceivingAsyncResponseFrom(173 /* AskForContinuouslyChoosingCardEvent */, skillEffectEvent.fromId);
                const resCard = engine_1.Sanguosha.getCardById(response.selectedCard);
                for (const id of displayCardIds) {
                    const card = engine_1.Sanguosha.getCardById(id);
                    if (card.CardNumber === resCard.CardNumber) {
                        const node = { card: id };
                        if (resCard.Id === id) {
                            node.player = skillEffectEvent.fromId;
                        }
                        selectedCardIds.push(node);
                    }
                }
                room.broadcast(129 /* ObserveCardsEvent */, chooseJiuFaCardEvent);
            }
            room.endProcessOnTag(displayCardIds.toString());
            await room.moveCards({
                movingCards: [
                    ...selectedCardIds
                        .filter(node => !!node.player)
                        .map(node => ({ card: node.card, fromArea: 6 /* ProcessingArea */ })),
                ],
                toId: skillEffectEvent.fromId,
                toArea: 0 /* HandArea */,
                moveReason: 1 /* ActivePrey */,
                proposer: skillEffectEvent.fromId,
                movedByReason: this.Name,
            });
            const droppedCards = selectedCardIds.filter(node => !node.player).map(node => node.card);
            await room.moveCards({
                movingCards: [...droppedCards.map(card => ({ card, fromArea: 6 /* ProcessingArea */ }))],
                toArea: 4 /* DropStack */,
                moveReason: 6 /* PlaceToDropStack */,
                proposer: skillEffectEvent.fromId,
                movedByReason: this.Name,
            });
            room.broadcast(130 /* ObserveCardFinishEvent */, {
                translationsMessage: droppedCards.length > 0
                    ? translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} has been placed into drop stack', translation_json_tool_1.TranslationPack.patchCardInTranslation(...droppedCards)).extract()
                    : undefined,
            });
        }
        return true;
    }
};
JiuFa = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'jiufa', description: 'jiufa_description' })
], JiuFa);
exports.JiuFa = JiuFa;
