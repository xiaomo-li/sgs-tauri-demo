"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JianYan = void 0;
const tslib_1 = require("tslib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let JianYan = class JianYan extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return !owner.hasUsedSkill(this.Name);
    }
    isRefreshAt(room, owner, phase) {
        return phase === 4 /* PlayCardStage */;
    }
    numberOfTargets() {
        return 0;
    }
    targetFilter() {
        return true;
    }
    cardFilter() {
        return true;
    }
    isAvailableCard() {
        return false;
    }
    isAvailableTarget() {
        return false;
    }
    async onUse() {
        return true;
    }
    jianYanMatch(cardType) {
        switch (cardType) {
            case 'basic card':
                return new card_matcher_1.CardMatcher({ type: [0 /* Basic */] });
            case 'trick card':
                return new card_matcher_1.CardMatcher({ type: [7 /* Trick */] });
            case 'equip card':
                return new card_matcher_1.CardMatcher({ type: [1 /* Equip */] });
            case 'jianyan:red':
                return new card_matcher_1.CardMatcher({ suit: [4 /* Diamond */, 2 /* Heart */] });
            case 'jianyan:black':
                return new card_matcher_1.CardMatcher({ suit: [3 /* Club */, 1 /* Spade */] });
            default:
                throw new Error('Unknown jianyan type');
        }
    }
    async onEffect(room, skillUseEvent) {
        const { fromId } = skillUseEvent;
        const options = ['basic card', 'trick card', 'equip card', 'jianyan:red', 'jianyan:black'];
        const askForChooseEvent = event_packer_1.EventPacker.createUncancellableEvent({
            options,
            conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose a card type or color', this.Name).extract(),
            toId: fromId,
            triggeredBySkills: [this.Name],
        });
        room.notify(168 /* AskForChoosingOptionsEvent */, askForChooseEvent, fromId);
        const response = await room.onReceivingAsyncResponseFrom(168 /* AskForChoosingOptionsEvent */, fromId);
        response.selectedOption = response.selectedOption || 'trick card';
        const cardMatcher = this.jianYanMatch(response.selectedOption);
        let pendingCardIds = room.findCardsByMatcherFrom(cardMatcher);
        if (pendingCardIds.length === 0) {
            pendingCardIds = room.findCardsByMatcherFrom(cardMatcher, false);
            room.shuffle();
        }
        if (pendingCardIds.length === 0) {
            return false;
        }
        const displayCards = [pendingCardIds[0]];
        await room.moveCards({
            movingCards: displayCards.map(card => ({ card, fromArea: 5 /* DrawStack */ })),
            toArea: 6 /* ProcessingArea */,
            moveReason: 3 /* PassiveMove */,
            movedByReason: this.Name,
        });
        const observeCardsEvent = {
            cardIds: displayCards,
            selected: [],
        };
        room.broadcast(129 /* ObserveCardsEvent */, observeCardsEvent);
        const choosePlayerEvent = {
            players: room
                .getAlivePlayersFrom()
                .filter(p => p.Gender === 0 /* Male */)
                .map(p => p.Id),
            toId: fromId,
            requiredAmount: 1,
            conversation: 'jianyan:Please choose a target to obtain the card you show',
            triggeredBySkills: [this.Name],
        };
        room.notify(167 /* AskForChoosingPlayerEvent */, choosePlayerEvent, fromId);
        const choosePlayerResponse = await room.onReceivingAsyncResponseFrom(167 /* AskForChoosingPlayerEvent */, fromId);
        const target = choosePlayerResponse.selectedPlayers === undefined ? fromId : choosePlayerResponse.selectedPlayers[0];
        room.broadcast(130 /* ObserveCardFinishEvent */, {});
        await room.moveCards({
            movingCards: displayCards.map(card => ({ card, fromArea: 6 /* ProcessingArea */ })),
            toId: target,
            toArea: 0 /* HandArea */,
            moveReason: 1 /* ActivePrey */,
            proposer: fromId,
            movedByReason: this.Name,
        });
        return true;
    }
};
JianYan = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'jianyan', description: 'jianyan_description' })
], JianYan);
exports.JianYan = JianYan;
