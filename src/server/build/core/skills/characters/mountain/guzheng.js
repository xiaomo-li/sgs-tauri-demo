"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuZheng = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let GuZheng = class GuZheng extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        if (content.playerId === owner.Id ||
            content.toStage !== 18 /* DropCardStageEnd */ ||
            room.getPlayerById(content.playerId).Dead) {
            return false;
        }
        const events = room.Analytics.getCardDropRecord(content.playerId, 'phase');
        const findFunc = (event) => event.infos.find(info => info.movingCards.find(card => card.fromArea === 0 /* HandArea */));
        return events.find(findFunc) !== undefined;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const { fromId, triggeredOnEvent } = skillUseEvent;
        const events = room.Analytics.getRecordEvents(event => event_packer_1.EventPacker.getIdentifier(event) === 128 /* MoveCardEvent */ &&
            event.infos.find(info => info.moveReason === 4 /* SelfDrop */ || info.moveReason === 5 /* PassiveDrop */) !== undefined, undefined, 'round', [5 /* DropCardStage */]);
        if (events === undefined) {
            return false;
        }
        const allCards = [];
        const guzhengee = triggeredOnEvent.playerId;
        events.forEach(event => {
            for (const info of event.infos) {
                const isGuzhengee = info.fromId === guzhengee;
                info.movingCards.forEach(({ card, fromArea }) => {
                    if (!allCards.map(card => card.cardId).includes(card)) {
                        if (room.isCardInDropStack(card)) {
                            if (isGuzhengee === true && fromArea === 0 /* HandArea */) {
                                allCards.push({ cardId: card, enableToReturn: true });
                            }
                            else {
                                allCards.push({ cardId: card, enableToReturn: false });
                            }
                        }
                    }
                    else {
                        const index = allCards.findIndex(({ cardId, enableToReturn }) => cardId === card && enableToReturn === false);
                        if (index >= 0) {
                            allCards[index].enableToReturn = true;
                        }
                    }
                });
            }
        });
        const displayCardIds = [];
        const selectedCardIds = [];
        allCards.forEach(cardInfo => {
            displayCardIds.push(cardInfo.cardId);
            if (cardInfo.enableToReturn === false) {
                selectedCardIds.push({ card: cardInfo.cardId });
            }
        });
        room.addProcessingCards(displayCardIds.toString(), ...displayCardIds);
        const observeCardsEvent = {
            cardIds: displayCardIds,
            selected: selectedCardIds,
        };
        room.broadcast(129 /* ObserveCardsEvent */, observeCardsEvent);
        const chooseGuZhengCardEvent = {
            cardIds: displayCardIds,
            selected: selectedCardIds,
            toId: fromId,
            userId: fromId,
            triggeredBySkills: [this.Name],
        };
        room.notify(173 /* AskForContinuouslyChoosingCardEvent */, chooseGuZhengCardEvent, fromId);
        const response = await room.onReceivingAsyncResponseFrom(173 /* AskForContinuouslyChoosingCardEvent */, fromId);
        room.broadcast(129 /* ObserveCardsEvent */, chooseGuZhengCardEvent);
        room.endProcessOnTag(displayCardIds.toString());
        await room.moveCards({
            movingCards: [{ card: response.selectedCard, fromArea: 4 /* DropStack */ }],
            toId: guzhengee,
            toArea: 0 /* HandArea */,
            moveReason: 2 /* ActiveMove */,
            proposer: fromId,
            movedByReason: this.Name,
        });
        const obtainCards = displayCardIds.filter(node => node !== response.selectedCard);
        if (obtainCards.length > 0) {
            const askForChoice = {
                toId: fromId,
                options: ['yes', 'no'],
                conversation: 'guzheng: do you wanna obtain the rest of cards?',
                triggeredBySkills: [this.Name],
            };
            room.notify(168 /* AskForChoosingOptionsEvent */, askForChoice, fromId);
            const { selectedOption } = await room.onReceivingAsyncResponseFrom(168 /* AskForChoosingOptionsEvent */, fromId);
            room.broadcast(130 /* ObserveCardFinishEvent */, {});
            if (selectedOption === 'yes') {
                await room.moveCards({
                    movingCards: obtainCards.map(card => ({ card, fromArea: 4 /* DropStack */ })),
                    toId: fromId,
                    toArea: 0 /* HandArea */,
                    moveReason: 2 /* ActiveMove */,
                    proposer: fromId,
                    movedByReason: this.Name,
                });
            }
        }
        else {
            room.broadcast(130 /* ObserveCardFinishEvent */, {});
        }
        return true;
    }
};
GuZheng = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'guzheng', description: 'guzheng_description' })
], GuZheng);
exports.GuZheng = GuZheng;
