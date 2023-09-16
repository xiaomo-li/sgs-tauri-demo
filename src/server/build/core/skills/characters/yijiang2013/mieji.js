"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MieJi = void 0;
const tslib_1 = require("tslib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let MieJi = class MieJi extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return (!owner.hasUsedSkill(this.Name) &&
            owner
                .getCardIds(0 /* HandArea */)
                .filter(cardId => engine_1.Sanguosha.getCardById(cardId).isBlack() && engine_1.Sanguosha.getCardById(cardId).is(7 /* Trick */))
                .length > 0);
    }
    numberOfTargets() {
        return 1;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    isAvailableTarget(owner, room, target) {
        return owner !== target && room.getPlayerById(target).getPlayerCards().length > 0;
    }
    availableCardAreas() {
        return [0 /* HandArea */];
    }
    isAvailableCard(owner, room, cardId) {
        const card = engine_1.Sanguosha.getCardById(cardId);
        return card.isBlack() && card.is(7 /* Trick */);
    }
    async onUse(room, event) {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        if (skillUseEvent.cardIds !== undefined) {
            await room.moveCards({
                movingCards: skillUseEvent.cardIds.map(card => ({ card, fromArea: 0 /* HandArea */ })),
                fromId: skillUseEvent.fromId,
                moveReason: 7 /* PlaceToDrawStack */,
                toArea: 5 /* DrawStack */,
                proposer: skillUseEvent.fromId,
                movedByReason: this.Name,
            });
        }
        const { toIds, fromId } = skillUseEvent;
        const toId = toIds[0];
        const to = room.getPlayerById(toId);
        const options = [];
        const nonTrickCards = to
            .getPlayerCards()
            .filter(cardId => !engine_1.Sanguosha.getCardById(cardId).is(7 /* Trick */) && room.canDropCard(fromId, cardId));
        if (to.getPlayerCards().filter(id => engine_1.Sanguosha.getCardById(id).is(7 /* Trick */)).length > 0) {
            options.push('mieji:trick');
        }
        if (nonTrickCards.length > 0) {
            options.push('mieji:drop');
        }
        const askForChooseOptionsEvent = {
            options,
            toId,
            conversation: 'please choose',
            triggeredBySkills: [this.Name],
        };
        room.notify(168 /* AskForChoosingOptionsEvent */, event_packer_1.EventPacker.createUncancellableEvent(askForChooseOptionsEvent), toId);
        const { selectedOption } = await room.onReceivingAsyncResponseFrom(168 /* AskForChoosingOptionsEvent */, toId);
        if (selectedOption === 'mieji:trick') {
            const askForCard = {
                toId,
                cardAmount: 1,
                fromArea: [0 /* HandArea */],
                reason: this.Name,
                cardMatcher: new card_matcher_1.CardMatcher({ type: [7 /* Trick */] }).toSocketPassenger(),
                conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('please choose a trick card to pass to {0}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(fromId))).toString(),
                triggeredBySkills: [this.Name],
            };
            room.notify(163 /* AskForCardEvent */, event_packer_1.EventPacker.createUncancellableEvent(askForCard), toId);
            const { selectedCards } = await room.onReceivingAsyncResponseFrom(163 /* AskForCardEvent */, toId);
            await room.moveCards({
                movingCards: [{ card: selectedCards[0], fromArea: 0 /* HandArea */ }],
                fromId: toId,
                toId: skillUseEvent.fromId,
                toArea: 0 /* HandArea */,
                moveReason: 1 /* ActivePrey */,
                movedByReason: this.Name,
                proposer: skillUseEvent.fromId,
                engagedPlayerIds: [fromId, toId],
            });
        }
        else {
            let droppedCards = 0;
            while (droppedCards < Math.min(nonTrickCards.length, 2)) {
                const response = await room.askForCardDrop(toId, 1, [0 /* HandArea */, 1 /* EquipArea */], true, to
                    .getCardIds(0 /* HandArea */)
                    .filter(cardId => engine_1.Sanguosha.getCardById(cardId).BaseType === 7 /* Trick */), this.Name);
                if (response.droppedCards.length === 0) {
                    break;
                }
                await room.dropCards(4 /* SelfDrop */, response.droppedCards, toId);
                droppedCards++;
            }
        }
        return true;
    }
};
MieJi = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'mieji', description: 'mieji_description' })
], MieJi);
exports.MieJi = MieJi;
