"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cheat = void 0;
const tslib_1 = require("tslib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const engine_1 = require("core/game/engine");
const functional_1 = require("core/shares/libs/functional");
const skill_1 = require("core/skills/skill");
let Cheat = class Cheat extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return true;
    }
    numberOfTargets() {
        return 0;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 0;
    }
    isAvailableTarget() {
        return false;
    }
    isAvailableCard(owner, room, cardId) {
        return false;
    }
    async onUse(room, event) {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const askForChoose = {
            toId: skillUseEvent.fromId,
            options: [
                functional_1.Functional.getCardTypeRawText(0 /* Basic */),
                functional_1.Functional.getCardTypeRawText(1 /* Equip */),
                functional_1.Functional.getCardTypeRawText(7 /* Trick */),
            ],
            conversation: 'please choose',
        };
        room.notify(168 /* AskForChoosingOptionsEvent */, askForChoose, skillUseEvent.fromId);
        const { selectedOption } = await room.onReceivingAsyncResponseFrom(168 /* AskForChoosingOptionsEvent */, skillUseEvent.fromId);
        const type = selectedOption === functional_1.Functional.getCardTypeRawText(0 /* Basic */)
            ? 0 /* Basic */
            : selectedOption === functional_1.Functional.getCardTypeRawText(1 /* Equip */)
                ? 1 /* Equip */
                : selectedOption === functional_1.Functional.getCardTypeRawText(7 /* Trick */)
                    ? 7 /* Trick */
                    : undefined;
        askForChoose.options = engine_1.Sanguosha.getCardsByMatcher(new card_matcher_1.CardMatcher({
            type: type === undefined ? undefined : [type],
        })).map(card => card.Name);
        room.notify(168 /* AskForChoosingOptionsEvent */, askForChoose, skillUseEvent.fromId);
        const { selectedOption: selectedName } = await room.onReceivingAsyncResponseFrom(168 /* AskForChoosingOptionsEvent */, skillUseEvent.fromId);
        askForChoose.options = engine_1.Sanguosha.getCardsByMatcher(new card_matcher_1.CardMatcher({
            type: type === undefined ? undefined : [type],
            name: selectedName === undefined ? undefined : [selectedName],
        })).map(card => functional_1.Functional.getCardSuitRawText(card.Suit));
        room.notify(168 /* AskForChoosingOptionsEvent */, askForChoose, skillUseEvent.fromId);
        const { selectedOption: selectedSuit } = await room.onReceivingAsyncResponseFrom(168 /* AskForChoosingOptionsEvent */, skillUseEvent.fromId);
        const suitMap = {
            nosuit: 0 /* NoSuit */,
            spade: 1 /* Spade */,
            heart: 2 /* Heart */,
            club: 3 /* Club */,
            diamond: 4 /* Diamond */,
        };
        const from = room.getPlayerById(skillUseEvent.fromId);
        const cards = engine_1.Sanguosha.getCardsByMatcher(new card_matcher_1.CardMatcher({
            name: selectedName ? [selectedName] : undefined,
            type: type === undefined ? undefined : [type],
            suit: selectedSuit === undefined ? undefined : [suitMap[selectedSuit]],
        })).filter(card => from.getCardId(card.Id) === undefined);
        if (cards.length > 0) {
            const fromOthers = room.getCardOwnerId(cards[0].Id);
            const owner = fromOthers ? room.getPlayerById(fromOthers) : undefined;
            await room.moveCards({
                movingCards: [
                    {
                        card: cards[0].Id,
                        fromArea: owner
                            ? owner.cardFrom(cards[0].Id)
                            : room.isCardInDropStack(cards[0].Id)
                                ? 4 /* DropStack */
                                : 5 /* DrawStack */,
                    },
                ],
                fromId: fromOthers,
                toId: skillUseEvent.fromId,
                toArea: 0 /* HandArea */,
                moveReason: 1 /* ActivePrey */,
                proposer: skillUseEvent.fromId,
                movedByReason: this.Name,
            });
        }
        return true;
    }
};
Cheat = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'cheat', description: 'cheat_description' })
], Cheat);
exports.Cheat = Cheat;
