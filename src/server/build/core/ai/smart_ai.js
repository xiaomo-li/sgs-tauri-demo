"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmartAI = void 0;
const card_matcher_1 = require("core/cards/libs/card_matcher");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const system_1 = require("core/shares/libs/system");
const skill_1 = require("core/skills/skill");
const ai_1 = require("./ai");
const ai_lib_1 = require("./ai_lib");
class SmartAI extends ai_1.PlayerAI {
    static get Instance() {
        if (!this.instance) {
            this.instance = new SmartAI();
        }
        return this.instance;
    }
    onAskForPlayCardsOrSkillsEvent(content, room) {
        var _a;
        const { toId: fromId } = content;
        const from = room.getPlayerById(fromId);
        const skills = from.getSkills('active');
        const cards = ai_lib_1.AiLibrary.sortCardsUsePriority(room, from);
        const actionItems = ai_lib_1.AiLibrary.sortCardAndSkillUsePriority(room, from, skills, cards);
        for (const item of actionItems) {
            if (item instanceof skill_1.ActiveSkill) {
                const useSkill = (_a = item
                    .tryToCallAiTrigger()) === null || _a === void 0 ? void 0 : _a.skillTrigger(room, from, item, undefined);
                if (useSkill) {
                    const useSkillEvent = {
                        fromId,
                        end: false,
                        eventName: 132 /* SkillUseEvent */,
                        event: useSkill,
                    };
                    return useSkillEvent;
                }
            }
            else {
                const card = engine_1.Sanguosha.getCardById(item);
                const cardSkill = card.Skill;
                const aiSkill = cardSkill.tryToCallAiTrigger();
                if (cardSkill instanceof skill_1.ActiveSkill && (aiSkill === null || aiSkill === void 0 ? void 0 : aiSkill.reforgeTrigger(room, from, cardSkill, item))) {
                    const reforgeEvent = {
                        fromId,
                        end: false,
                        eventName: 122 /* ReforgeEvent */,
                        event: {
                            cardId: item,
                            fromId,
                        },
                    };
                    return reforgeEvent;
                }
                if (!from.canUseCard(room, item)) {
                    continue;
                }
                if (card.BaseType === 1 /* Equip */) {
                    //@@TODO: equip comparison here
                    if (from.getEquipment(card.EquipType) === undefined) {
                        const equipCardUseEvent = {
                            fromId: from.Id,
                            cardId: item,
                        };
                        const equipUse = {
                            fromId: from.Id,
                            eventName: 124 /* CardUseEvent */,
                            end: false,
                            event: equipCardUseEvent,
                        };
                        return equipUse;
                    }
                    else {
                        continue;
                    }
                }
                const useCard = cardSkill instanceof skill_1.ActiveSkill &&
                    (aiSkill === null || aiSkill === void 0 ? void 0 : aiSkill.skillTrigger(room, from, cardSkill, item));
                if (useCard) {
                    const useCardEvent = {
                        fromId,
                        end: false,
                        eventName: 124 /* CardUseEvent */,
                        event: useCard,
                    };
                    return useCardEvent;
                }
            }
        }
        const endEvent = {
            fromId,
            end: true,
        };
        return endEvent;
    }
    onAskForSkillUseEvent(content, room) {
        const { invokeSkillNames, toId, triggeredOnEvent } = content;
        const from = room.getPlayerById(toId);
        for (const skillName of invokeSkillNames) {
            const skill = engine_1.Sanguosha.getSkillBySkillName(skillName);
            const aiSkill = skill.tryToCallAiTrigger();
            let skillCardId;
            if (from.getEquipSkills().includes(skill)) {
                skillCardId = from
                    .getCardIds(1 /* EquipArea */)
                    .find(cardId => engine_1.Sanguosha.getCardById(cardId).Skill === skill);
            }
            const triggerEvent = aiSkill === null || aiSkill === void 0 ? void 0 : aiSkill.skillTrigger(room, from, skill, triggeredOnEvent, skillCardId);
            if (triggerEvent) {
                return triggerEvent;
            }
        }
        if (event_packer_1.EventPacker.isUncancellableEvent(content)) {
            const skillUse = {
                invoke: invokeSkillNames !== undefined && invokeSkillNames[0] !== undefined ? invokeSkillNames[0] : undefined,
                fromId: toId,
            };
            return skillUse;
        }
        const skillUse = {
            fromId: toId,
        };
        return skillUse;
    }
    onAskForCardResponseEvent(content, room) {
        var _a, _b;
        const { toId, cardMatcher, byCardId, cardUserId } = content;
        const toPlayer = room.getPlayerById(toId);
        const cardMatcherInstance = new card_matcher_1.CardMatcher(cardMatcher);
        const availableCards = ai_lib_1.AiLibrary.findAvailableCardsToResponse(room, toPlayer, content, cardMatcherInstance);
        for (const skillName of content.triggeredBySkills || []) {
            const skill = engine_1.Sanguosha.getSkillBySkillName(skillName);
            const aiSkill = skill.tryToCallAiTrigger();
            const response = (_a = aiSkill === null || aiSkill === void 0 ? void 0 : aiSkill.onAskForCardResponseEvent) === null || _a === void 0 ? void 0 : _a.call(aiSkill, content, room, availableCards);
            if (response) {
                return response;
            }
        }
        const cardNames = cardMatcherInstance.Matcher.generalName || cardMatcherInstance.Matcher.name || [];
        for (const cardName of cardNames) {
            const skill = engine_1.Sanguosha.getSkillBySkillName(cardName);
            const aiSkill = skill.tryToCallAiTrigger();
            const response = (_b = aiSkill === null || aiSkill === void 0 ? void 0 : aiSkill.onAskForCardResponseEvent) === null || _b === void 0 ? void 0 : _b.call(aiSkill, content, room, availableCards);
            if (response) {
                return response;
            }
        }
        if (event_packer_1.EventPacker.isUncancellableEvent(content)) {
            const cardResponse = {
                fromId: toId,
                cardId: availableCards.length > 0 ? ai_lib_1.AiLibrary.sortCardbyValue(availableCards)[0] : undefined,
            };
            return cardResponse;
        }
        else {
            let cardId = availableCards[0];
            if (card_matcher_1.CardMatcher.match(cardMatcher, new card_matcher_1.CardMatcher({ name: ['jink'] })) &&
                !ai_lib_1.AiLibrary.shouldUseJink(room, toPlayer, availableCards, byCardId, cardUserId)) {
                cardId = undefined;
            }
            const cardResponse = {
                fromId: toId,
                cardId,
            };
            return cardResponse;
        }
    }
    onAskForCardUseEvent(content, room) {
        var _a, _b;
        const { toId, cardMatcher } = content;
        const toPlayer = room.getPlayerById(toId);
        const cardMatcherInstance = new card_matcher_1.CardMatcher(cardMatcher);
        const availableCards = ai_lib_1.AiLibrary.findAvailableCardsToUse(room, toPlayer, cardMatcherInstance);
        for (const skillName of content.triggeredBySkills || []) {
            const skill = engine_1.Sanguosha.getSkillBySkillName(skillName);
            const aiSkill = skill.tryToCallAiTrigger();
            const response = (_a = aiSkill === null || aiSkill === void 0 ? void 0 : aiSkill.onAskForCardUseEvent) === null || _a === void 0 ? void 0 : _a.call(aiSkill, content, room, availableCards);
            if (response) {
                return response;
            }
        }
        const cardNames = cardMatcherInstance.Matcher.generalName || cardMatcherInstance.Matcher.name || [];
        for (const cardName of cardNames) {
            const skill = engine_1.Sanguosha.getSkillBySkillName(cardName);
            const aiSkill = skill.tryToCallAiTrigger();
            const response = (_b = aiSkill === null || aiSkill === void 0 ? void 0 : aiSkill.onAskForCardUseEvent) === null || _b === void 0 ? void 0 : _b.call(aiSkill, content, room, availableCards);
            if (response) {
                return response;
            }
        }
        if (event_packer_1.EventPacker.isUncancellableEvent(content)) {
            const cardResponse = {
                fromId: toId,
                cardId: availableCards.length > 0 ? ai_lib_1.AiLibrary.sortCardbyValue(availableCards)[0] : undefined,
                toIds: content.scopedTargets,
            };
            return cardResponse;
        }
        else {
            let cardResponse = { fromId: toId };
            const cardIds = ai_lib_1.AiLibrary.askAiUseCard(room, toId, availableCards, cardMatcher, content.byCardId, content.cardUserId);
            if (cardIds.length > 0) {
                cardResponse = {
                    cardId: ai_lib_1.AiLibrary.sortCardbyValue(cardIds)[0],
                    fromId: toId,
                    toIds: content.scopedTargets,
                };
            }
            return cardResponse;
        }
    }
    onAskForCardDropEvent(content, room) {
        var _a;
        const { toId, cardAmount, fromArea, except } = content;
        const to = room.getPlayerById(toId);
        const availableCards = fromArea.reduce((savedCards, area) => {
            for (const card of to.getCardIds(area)) {
                if (!to.getSkills('filter').find(skill => skill.canDropCard(card, room, toId) === false)) {
                    savedCards.push(card);
                }
            }
            return savedCards;
        }, []);
        for (const skillName of content.triggeredBySkills || []) {
            const skill = engine_1.Sanguosha.getSkillBySkillName(skillName);
            const aiSkill = skill.tryToCallAiTrigger();
            const response = (_a = aiSkill === null || aiSkill === void 0 ? void 0 : aiSkill.onAskForCardDropEvent) === null || _a === void 0 ? void 0 : _a.call(aiSkill, content, room, availableCards);
            if (response) {
                return response;
            }
        }
        const cardDrop = {
            fromId: toId,
            droppedCards: [],
        };
        if (event_packer_1.EventPacker.isUncancellableEvent(content) || content.triggeredBySkills !== undefined) {
            let cards = fromArea.reduce((allCards, area) => [...allCards, ...to.getCardIds(area).filter(cardId => !(except === null || except === void 0 ? void 0 : except.includes(cardId)))], []);
            if (cards.length === 0) {
                return cardDrop;
            }
            const holdAmount = cards.length -
                (cardAmount instanceof Array ? (content.triggeredBySkills ? cardAmount[0] : cardAmount[1]) : cardAmount);
            cards = ai_lib_1.AiLibrary.sortCardbyValue(cards);
            cardDrop.droppedCards = cards.slice(holdAmount);
        }
        return cardDrop;
    }
    onAskForPeachEvent(content, room) {
        const { fromId, toId } = content;
        const selfRescue = fromId === toId;
        const from = room.getPlayerById(fromId);
        const to = room.getPlayerById(toId);
        if (!ai_lib_1.AiLibrary.areTheyFriendly(from, to, room.Info.gameMode)) {
            return {
                fromId: content.fromId,
            };
        }
        const rescueCards = ai_lib_1.AiLibrary.findCardsByMatcher(room, from, new card_matcher_1.CardMatcher({ generalName: selfRescue ? ['alcohol', 'peach'] : ['peach'] }));
        const alcoholCard = rescueCards.find(cardId => engine_1.Sanguosha.getCardById(cardId).GeneralName === 'alcohol');
        const usePeach = {
            fromId: content.fromId,
            cardId: alcoholCard || rescueCards[0],
        };
        return usePeach;
    }
    onAskForCardDisplayEvent(content, room) {
        var _a;
        const { cardAmount, cardMatcher, toId } = content;
        const to = room.getPlayerById(toId);
        const handCards = to.getCardIds(0 /* HandArea */);
        for (const skillName of content.triggeredBySkills || []) {
            const skill = engine_1.Sanguosha.getSkillBySkillName(skillName);
            const aiSkill = skill.tryToCallAiTrigger();
            const response = (_a = aiSkill === null || aiSkill === void 0 ? void 0 : aiSkill.onAskForCardDisplayEvent) === null || _a === void 0 ? void 0 : _a.call(aiSkill, content, room, handCards);
            if (response) {
                return response;
            }
        }
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
        var _a;
        for (const skillName of content.triggeredBySkills || []) {
            const skill = engine_1.Sanguosha.getSkillBySkillName(skillName);
            const aiSkill = skill.tryToCallAiTrigger();
            const response = (_a = aiSkill === null || aiSkill === void 0 ? void 0 : aiSkill.onAskForCardEvent) === null || _a === void 0 ? void 0 : _a.call(aiSkill, content, room);
            if (response) {
                return response;
            }
        }
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
        var _a;
        for (const skillName of content.triggeredBySkills || []) {
            const skill = engine_1.Sanguosha.getSkillBySkillName(skillName);
            const aiSkill = skill.tryToCallAiTrigger();
            const response = (_a = aiSkill === null || aiSkill === void 0 ? void 0 : aiSkill.onAskForPinDianCardEvent) === null || _a === void 0 ? void 0 : _a.call(aiSkill, content, room);
            if (response) {
                return response;
            }
        }
        const pindianEvent = {
            fromId: content.toId,
            pindianCard: room.getPlayerById(content.toId).getCardIds(0 /* HandArea */)[0],
        };
        return pindianEvent;
    }
    onAskForChoosingCardEvent(content, room) {
        var _a;
        for (const skillName of content.triggeredBySkills || []) {
            const skill = engine_1.Sanguosha.getSkillBySkillName(skillName);
            const aiSkill = skill.tryToCallAiTrigger();
            const response = (_a = aiSkill === null || aiSkill === void 0 ? void 0 : aiSkill.onAskForChoosingCardEvent) === null || _a === void 0 ? void 0 : _a.call(aiSkill, content, room);
            if (response) {
                return response;
            }
        }
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
        var _a;
        for (const skillName of content.triggeredBySkills || []) {
            const skill = engine_1.Sanguosha.getSkillBySkillName(skillName);
            const aiSkill = skill.tryToCallAiTrigger();
            const response = (_a = aiSkill === null || aiSkill === void 0 ? void 0 : aiSkill.onAskForChoosingPlayerEvent) === null || _a === void 0 ? void 0 : _a.call(aiSkill, content, room);
            if (response) {
                return response;
            }
        }
        const { requiredAmount, players, toId } = content;
        const amount = requiredAmount instanceof Array ? requiredAmount[0] : requiredAmount;
        const choosePlayer = {
            fromId: toId,
            selectedPlayers: players.slice(0, amount),
        };
        return choosePlayer;
    }
    onAskForChoosingOptionsEvent(content, room) {
        var _a;
        for (const skillName of content.triggeredBySkills || []) {
            const skill = engine_1.Sanguosha.getSkillBySkillName(skillName);
            const aiSkill = skill.tryToCallAiTrigger();
            const response = (_a = aiSkill === null || aiSkill === void 0 ? void 0 : aiSkill.onAskForChoosingOptionsEvent) === null || _a === void 0 ? void 0 : _a.call(aiSkill, content, room);
            if (response) {
                return response;
            }
        }
        const { toId, options } = content;
        const chooseOptions = {
            selectedOption: options[0],
            fromId: toId,
        };
        return chooseOptions;
    }
    onAskForChoosingCharacterEvent(content, room) {
        var _a;
        for (const skillName of content.triggeredBySkills || []) {
            const skill = engine_1.Sanguosha.getSkillBySkillName(skillName);
            const aiSkill = skill.tryToCallAiTrigger();
            const response = (_a = aiSkill === null || aiSkill === void 0 ? void 0 : aiSkill.onAskForChoosingCharacterEvent) === null || _a === void 0 ? void 0 : _a.call(aiSkill, content, room);
            if (response) {
                return response;
            }
        }
        const { characterIds, toId } = content;
        const chooseCharacter = {
            chosenCharacterIds: characterIds,
            fromId: toId,
        };
        return chooseCharacter;
    }
    onAskForChoosingCardFromPlayerEvent(content, room) {
        var _a;
        for (const skillName of content.triggeredBySkills || []) {
            const skill = engine_1.Sanguosha.getSkillBySkillName(skillName);
            const aiSkill = skill.tryToCallAiTrigger();
            const response = (_a = aiSkill === null || aiSkill === void 0 ? void 0 : aiSkill.onAskForChoosingCardFromPlayerEvent) === null || _a === void 0 ? void 0 : _a.call(aiSkill, content, room);
            if (response) {
                return response;
            }
        }
        const { options, fromId, toId } = content;
        const chooseCard = ai_lib_1.AiLibrary.askAiChooseCardFromPlayer(room, fromId, toId, options);
        return chooseCard;
    }
    onAskForPlaceCardsInDileEvent(content, room) {
        var _a;
        for (const skillName of content.triggeredBySkills || []) {
            const skill = engine_1.Sanguosha.getSkillBySkillName(skillName);
            const aiSkill = skill.tryToCallAiTrigger();
            const response = (_a = aiSkill === null || aiSkill === void 0 ? void 0 : aiSkill.onAskForPlaceCardsInDileEvent) === null || _a === void 0 ? void 0 : _a.call(aiSkill, content, room);
            if (response) {
                return response;
            }
        }
        const placeCards = {
            top: content.cardIds.slice(0, content.top),
            bottom: content.cardIds.slice(content.top, content.top + content.bottom),
            fromId: content.toId,
        };
        return placeCards;
    }
    onAskForContinuouslyChoosingCardEvent(content, room) {
        var _a;
        const { toId, cardIds, selected, triggeredBySkills } = content;
        for (const skillName of triggeredBySkills) {
            const skill = engine_1.Sanguosha.getSkillBySkillName(skillName);
            const aiSkill = skill.tryToCallAiTrigger();
            const response = (_a = aiSkill === null || aiSkill === void 0 ? void 0 : aiSkill.onAskForContinuouslyChoosingCardEvent) === null || _a === void 0 ? void 0 : _a.call(aiSkill, content, room);
            if (response) {
                return response;
            }
        }
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
            selectedCards: selectedCards.length > 0 ? selectedCards : undefined,
            selectedCardsIndex: selectedCardsIndex.length > 0 ? selectedCardsIndex : undefined,
        };
    }
}
exports.SmartAI = SmartAI;
