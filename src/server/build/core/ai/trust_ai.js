"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrustAI = void 0;
const card_matcher_1 = require("core/cards/libs/card_matcher");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const system_1 = require("core/shares/libs/system");
const ai_1 = require("./ai");
const ai_lib_1 = require("./ai_lib");
class TrustAI extends ai_1.PlayerAI {
    static get Instance() {
        if (!this.instance) {
            this.instance = new TrustAI();
        }
        return this.instance;
    }
    onAskForPlayCardsOrSkillsEvent(content, room) {
        const { toId: fromId } = content;
        const endEvent = {
            fromId,
            end: true,
        };
        return endEvent;
    }
    onAskForSkillUseEvent(content, room) {
        const { invokeSkillNames, toId } = content;
        if (!event_packer_1.EventPacker.isUncancellableEvent(content)) {
            const skillUse = {
                invoke: invokeSkillNames !== undefined && invokeSkillNames[0] !== undefined ? invokeSkillNames[0] : undefined,
                fromId: toId,
            };
            return skillUse;
        }
        const skillUse = {
            fromId: toId,
            invoke: invokeSkillNames[0],
        };
        return skillUse;
    }
    onAskForCardResponseEvent(content, room) {
        // const logs: string =
        //   `AskForCardResponseEvent, ask Card ${content.cardMatcher.name} or ${content.cardMatcher.generalName} ` +
        //   (content !== undefined && content!.byCardId !== undefined
        //     ? `for Reponse ${Sanguosha.getCardById(content!.byCardId).Name}`
        //     : '');
        const { toId, cardMatcher } = content;
        if (event_packer_1.EventPacker.isUncancellableEvent(content)) {
            const cardResponse = {
                fromId: toId,
                cardId: room
                    .getPlayerById(toId)
                    .getCardIds(0 /* HandArea */)
                    .find(cardId => card_matcher_1.CardMatcher.match(cardMatcher, engine_1.Sanguosha.getCardById(cardId))),
            };
            return cardResponse;
        }
        else {
            // just handle nanmanruqin and duel, not enough for another judge
            let cardId;
            if (cardMatcher.generalName && cardMatcher.generalName.includes('slash')) {
                cardId = room
                    .getPlayerById(toId)
                    .getCardIds(0 /* HandArea */)
                    .find(cardId => card_matcher_1.CardMatcher.match(cardMatcher, engine_1.Sanguosha.getCardById(cardId)));
            }
            const cardResponse = {
                fromId: toId,
                cardId,
            };
            return cardResponse;
        }
    }
    onAskForCardUseEvent(content, room) {
        const { toId, cardMatcher } = content;
        const toPlayer = room.getPlayerById(toId);
        const availableCards = ai_lib_1.AiLibrary.findAvailableCardsToUse(room, toPlayer, new card_matcher_1.CardMatcher(cardMatcher));
        if (event_packer_1.EventPacker.isUncancellableEvent(content)) {
            const cardResponse = {
                fromId: toId,
                cardId: availableCards[0],
            };
            return cardResponse;
        }
        else {
            let cardResponse = { fromId: toId };
            const cardIds = ai_lib_1.AiLibrary.askAiUseCard(room, toId, availableCards, cardMatcher, content.byCardId);
            if (cardIds.length > 0) {
                const responseCardId = cardIds.sort((a, b) => ai_lib_1.AiLibrary.getCardValueofCard(a).value - ai_lib_1.AiLibrary.getCardValueofCard(b).value)[0];
                cardResponse = {
                    cardId: responseCardId,
                    fromId: toId,
                    toIds: content.scopedTargets,
                };
            }
            return cardResponse;
        }
    }
    onAskForCardDropEvent(content, room) {
        const { toId, cardAmount, fromArea, except } = content;
        const to = room.getPlayerById(toId);
        const cardDrop = {
            fromId: toId,
            droppedCards: [],
        };
        if (event_packer_1.EventPacker.isUncancellableEvent(content) || content.triggeredBySkills !== undefined) {
            let cards = fromArea.reduce((allCards, area) => [...allCards, ...to.getCardIds(area).filter(cardId => !(except === null || except === void 0 ? void 0 : except.includes(cardId)))], []);
            if (cards.length === 0) {
                return cardDrop;
            }
            const holdAmount = cards.length - (cardAmount instanceof Array ? cardAmount[0] : cardAmount);
            cards = ai_lib_1.AiLibrary.sortCardbyValue(cards);
            cardDrop.droppedCards = cards.slice(holdAmount);
        }
        return cardDrop;
    }
    onAskForPeachEvent(content, room) {
        const usePeach = {
            fromId: content.toId,
        };
        return usePeach;
    }
    onAskForCardDisplayEvent(content, room) {
        const { cardAmount, cardMatcher, toId } = content;
        const to = room.getPlayerById(toId);
        const handCards = to.getCardIds(0 /* HandArea */);
        const displayedCards = cardMatcher === undefined
            ? handCards.slice(0, cardAmount)
            : handCards
                .filter(cardId => card_matcher_1.CardMatcher.match(cardMatcher, engine_1.Sanguosha.getCardById(cardId)))
                .slice(0, cardAmount);
        const displayCards = {
            fromId: toId,
            selectedCards: displayedCards,
        };
        return displayCards;
    }
    onAskForCardEvent(content, room) {
        const { cardAmount, cardAmountRange, cardMatcher, toId, fromArea } = content;
        const amount = cardAmount || (cardAmountRange && cardAmountRange[0]);
        const to = room.getPlayerById(toId);
        const selectedCards = fromArea
            .reduce((allCards, area) => {
            if (cardMatcher) {
                allCards.push(...to.getCardIds(area).filter(card => card_matcher_1.CardMatcher.match(cardMatcher, engine_1.Sanguosha.getCardById(card))));
            }
            else {
                allCards.push(...to.getCardIds(area));
            }
            return allCards;
        }, [])
            .slice(0, amount);
        const selectCard = {
            fromId: toId,
            selectedCards,
        };
        return selectCard;
    }
    onAskForPinDianCardEvent(content, room) {
        const pindianEvent = {
            fromId: content.toId,
            pindianCard: room.getPlayerById(content.toId).getCardIds(0 /* HandArea */)[0],
        };
        return pindianEvent;
    }
    onAskForChoosingCardEvent(content, room) {
        const { cardIds, cardMatcher, toId, amount, customCardFields } = content;
        let selectedCardIndex;
        let selectedCards;
        if (cardIds !== undefined) {
            selectedCardIndex = typeof cardIds === 'number' ? new Array(amount).fill(0).map((_, index) => index) : undefined;
            selectedCards =
                cardIds instanceof Array
                    ? cardIds
                        .filter(cardId => (cardMatcher ? card_matcher_1.CardMatcher.match(cardMatcher, engine_1.Sanguosha.getCardById(cardId)) : cardId))
                        .slice(0, amount)
                    : undefined;
        }
        else if (customCardFields !== undefined) {
            let avaliableCards = [];
            for (const cards of Object.values(customCardFields)) {
                if (cards instanceof Array) {
                    avaliableCards = avaliableCards.concat([...cards]);
                }
            }
            selectedCards = avaliableCards
                .filter(cardId => (cardMatcher ? card_matcher_1.CardMatcher.match(cardMatcher, engine_1.Sanguosha.getCardById(cardId)) : cardId))
                .slice(0, amount);
        }
        const chooseCard = {
            fromId: toId,
            selectedCardIndex,
            selectedCards,
        };
        return chooseCard;
    }
    onAskForChoosingPlayerEvent(content, room) {
        const { requiredAmount, players, toId } = content;
        const amount = requiredAmount instanceof Array ? requiredAmount[0] : requiredAmount;
        const choosePlayer = {
            fromId: toId,
            selectedPlayers: players.slice(0, amount),
        };
        return choosePlayer;
    }
    onAskForChoosingOptionsEvent(content, room) {
        const { toId, options } = content;
        const chooseOptions = {
            selectedOption: options[0],
            fromId: toId,
        };
        return chooseOptions;
    }
    onAskForChoosingCharacterEvent(content, room) {
        const { characterIds, toId } = content;
        const chooseCharacter = {
            chosenCharacterIds: characterIds,
            fromId: toId,
        };
        return chooseCharacter;
    }
    onAskForChoosingCardFromPlayerEvent(content, room) {
        const { options, fromId, toId } = content;
        if (!event_packer_1.EventPacker.isUncancellableEvent(content)) {
            const chooseCard = {
                fromId,
            };
            return chooseCard;
        }
        const chooseCard = ai_lib_1.AiLibrary.askAiChooseCardFromPlayer(room, fromId, toId, options);
        return chooseCard;
    }
    onAskForPlaceCardsInDileEvent(content, room) {
        const placeCards = {
            top: content.cardIds.slice(0, content.top),
            bottom: content.cardIds.slice(content.top, content.top + content.bottom),
            fromId: content.toId,
        };
        return placeCards;
    }
    onAskForContinuouslyChoosingCardEvent(content, room) {
        const { toId, cardIds, selected } = content;
        const selectedCard = cardIds.find(cardId => !selected.find(selectCard => selectCard.card === cardId));
        const chooseCard = {
            selectedCard,
            fromId: toId,
        };
        return chooseCard;
    }
    onAskForChoosingCardWithConditionsEvent(content, room) {
        var _a;
        const { amount, customCardFields, cardIds, cardFilter, involvedTargets, triggeredBySkills } = content;
        for (const skillName of triggeredBySkills) {
            const skill = engine_1.Sanguosha.getSkillBySkillName(skillName);
            const aiSkill = skill.tryToCallAiTrigger();
            const response = (_a = aiSkill === null || aiSkill === void 0 ? void 0 : aiSkill.onAskForChoosingCardWithConditionsEvent) === null || _a === void 0 ? void 0 : _a.call(aiSkill, content, room);
            if (response) {
                return response;
            }
        }
        if (!event_packer_1.EventPacker.isUncancellableEvent(content)) {
            return {
                fromId: content.toId,
            };
        }
        const selectedCards = [];
        let selectedCardsIndex = [];
        const cardAmount = amount instanceof Array ? amount[0] : amount;
        if (cardIds !== undefined) {
            if (cardIds instanceof Array) {
                selectedCards.push(...cardIds.slice(0, cardAmount));
            }
            else {
                selectedCardsIndex = Array.from(Array(cardAmount).keys());
            }
        }
        else if (cardFilter !== undefined) {
            const matcher = system_1.System.AskForChoosingCardEventFilters[cardFilter];
            const allCards = [];
            for (const cards of Object.values(customCardFields)) {
                if (cards instanceof Array) {
                    allCards.push(...cards);
                }
            }
            for (const cards of Object.values(customCardFields)) {
                if (cards instanceof Array) {
                    for (const card of cards) {
                        if (cardAmount && selectedCardsIndex.length + selectedCards.length === cardAmount) {
                            break;
                        }
                        if (!matcher(allCards, selectedCards, card, involvedTargets === null || involvedTargets === void 0 ? void 0 : involvedTargets.map(target => room.getPlayerById(target)))) {
                            selectedCards.push(card);
                        }
                    }
                }
                else {
                    selectedCardsIndex.push(...Array.from(Array(cardAmount).keys()).map(id => id + selectedCardsIndex.length));
                }
            }
        }
        return {
            fromId: content.toId,
            selectedCards,
            selectedCardsIndex,
        };
    }
}
exports.TrustAI = TrustAI;
