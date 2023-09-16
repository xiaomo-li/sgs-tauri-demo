"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SheLie = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let SheLie = class SheLie extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "BeforeDrawCardEffect" /* BeforeDrawCardEffect */;
    }
    canUse(room, owner, content) {
        return (owner.Id === content.fromId &&
            room.CurrentPlayerPhase === 3 /* DrawCardStage */ &&
            content.bySpecialReason === 0 /* GameStage */);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const { triggeredOnEvent } = skillUseEvent;
        const drawCardEvent = triggeredOnEvent;
        drawCardEvent.drawAmount = 0;
        const displayCardIds = room.getCards(5, 'top');
        const selectedCardIds = [];
        room.addProcessingCards(displayCardIds.toString(), ...displayCardIds);
        const observeCardsEvent = {
            cardIds: displayCardIds,
            selected: selectedCardIds,
        };
        room.broadcast(129 /* ObserveCardsEvent */, observeCardsEvent);
        while (selectedCardIds.length < 5) {
            const chooseSheLieCardEvent = {
                cardIds: displayCardIds,
                selected: selectedCardIds,
                toId: skillUseEvent.fromId,
                userId: skillUseEvent.fromId,
                triggeredBySkills: [this.Name],
            };
            room.notify(173 /* AskForContinuouslyChoosingCardEvent */, chooseSheLieCardEvent, skillUseEvent.fromId);
            const response = await room.onReceivingAsyncResponseFrom(173 /* AskForContinuouslyChoosingCardEvent */, skillUseEvent.fromId);
            const resCard = engine_1.Sanguosha.getCardById(response.selectedCard);
            displayCardIds.forEach(id => {
                const card = engine_1.Sanguosha.getCardById(id);
                if (card.Suit === resCard.Suit) {
                    const node = { card: id };
                    if (resCard.Id === id) {
                        node.player = skillUseEvent.fromId;
                    }
                    selectedCardIds.push(node);
                }
            });
            room.broadcast(129 /* ObserveCardsEvent */, chooseSheLieCardEvent);
        }
        room.endProcessOnTag(displayCardIds.toString());
        await room.moveCards({
            movingCards: [
                ...selectedCardIds
                    .filter(node => !!node.player)
                    .map(node => ({ card: node.card, fromArea: 6 /* ProcessingArea */ })),
            ],
            toId: skillUseEvent.fromId,
            toArea: 0 /* HandArea */,
            moveReason: 1 /* ActivePrey */,
            proposer: skillUseEvent.fromId,
            movedByReason: this.Name,
        });
        const droppedCards = selectedCardIds.filter(node => !node.player).map(node => node.card);
        await room.moveCards({
            movingCards: [...droppedCards.map(card => ({ card, fromArea: 6 /* ProcessingArea */ }))],
            toArea: 4 /* DropStack */,
            moveReason: 6 /* PlaceToDropStack */,
            proposer: skillUseEvent.fromId,
            movedByReason: this.Name,
        });
        room.broadcast(130 /* ObserveCardFinishEvent */, {
            translationsMessage: droppedCards.length > 0
                ? translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} has been placed into drop stack', translation_json_tool_1.TranslationPack.patchCardInTranslation(...droppedCards)).extract()
                : undefined,
        });
        return true;
    }
};
SheLie = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'shelie', description: 'shelie_description' })
], SheLie);
exports.SheLie = SheLie;
