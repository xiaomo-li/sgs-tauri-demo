"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecordAnalytics = void 0;
const card_1 = require("core/cards/card");
const event_packer_1 = require("core/event/event_packer");
class RecordAnalytics {
    constructor() {
        this.events = [];
        this.currentPhaseEvents = [];
        this.currentRoundEvents = {};
        this.currentCircleEvents = {};
    }
    turnTo(currentPlayer) {
        this.currentRoundEvents = {};
        this.currentPlayerId = currentPlayer;
    }
    turnToNextCircle() {
        this.currentCircleEvents = {};
    }
    turnToNextPhase() {
        this.currentPhaseEvents = [];
    }
    record(event, currentPhase) {
        this.events.push(event);
        this.currentPhaseEvents.push(event);
        if (currentPhase) {
            this.currentRoundEvents[currentPhase] = this.currentRoundEvents[currentPhase] || [];
            this.currentRoundEvents[currentPhase].push(event);
            this.currentCircleEvents[currentPhase] = this.currentCircleEvents[currentPhase] || [];
            this.currentCircleEvents[currentPhase].push(event);
        }
    }
    getRecordEvents(matcherFunction, player, current, inPhase, num = 0) {
        if (current) {
            if (inPhase !== undefined && current !== 'phase') {
                const currentEvents = current === 'round' ? this.currentRoundEvents : this.currentCircleEvents;
                let events = [];
                if (num > 0) {
                    for (const phase of inPhase) {
                        if (!currentEvents[phase]) {
                            continue;
                        }
                        for (const event of Object.values(currentEvents[phase])) {
                            if (matcherFunction(event)) {
                                events.push(event);
                            }
                            if (events.length === num) {
                                break;
                            }
                        }
                        if (events.length === num) {
                            break;
                        }
                    }
                    return events;
                }
                events = inPhase.reduce((selectedEvents, phase) => {
                    const phaseEvents = currentEvents[phase];
                    phaseEvents && selectedEvents.push(...phaseEvents);
                    return selectedEvents;
                }, []);
                return events.filter(event => matcherFunction(event) && (!player || player === this.currentPlayerId));
            }
            else {
                let events = [];
                if (current === 'phase') {
                    if (num > 0) {
                        for (const event of this.currentPhaseEvents) {
                            if (matcherFunction(event)) {
                                events.push(event);
                            }
                            if (events.length === num) {
                                break;
                            }
                        }
                        return events;
                    }
                    events = Object.values(this.currentPhaseEvents).reduce((allEvents, phaseEvent) => {
                        phaseEvent && allEvents.push(phaseEvent);
                        return allEvents;
                    }, []);
                }
                else {
                    const currentEvents = current === 'round' ? this.currentRoundEvents : this.currentCircleEvents;
                    if (num > 0) {
                        for (const currentEvent of Object.values(currentEvents)) {
                            if (currentEvent) {
                                for (const event of currentEvent) {
                                    if (matcherFunction(event)) {
                                        events.push(event);
                                    }
                                    if (events.length === num) {
                                        break;
                                    }
                                }
                                if (events.length === num) {
                                    break;
                                }
                            }
                        }
                        return events;
                    }
                    events = Object.values(currentEvents).reduce((allEvents, phaseEvents) => {
                        phaseEvents && allEvents.push(...phaseEvents);
                        return allEvents;
                    }, []);
                }
                return events.filter(event => matcherFunction(event) && (!player || player === this.currentPlayerId));
            }
        }
        else {
            if (num > 0) {
                const events = [];
                for (const event of this.events) {
                    if (matcherFunction(event)) {
                        events.push(event);
                    }
                    if (events.length === num) {
                        break;
                    }
                }
                return events;
            }
            return this.events.filter(matcherFunction);
        }
    }
    getRecoveredHpRecord(player, current, inPhase, num = 0) {
        return this.getRecordEvents(event => event_packer_1.EventPacker.getIdentifier(event) === 138 /* RecoverEvent */ && event.toId === player, undefined, current, inPhase, num);
    }
    getDamageRecord(player, current, inPhase, num = 0) {
        return this.getRecordEvents(event => event_packer_1.EventPacker.getIdentifier(event) === 137 /* DamageEvent */ && event.fromId === player, undefined, current, inPhase, num);
    }
    getDamagedRecord(player, current, inPhase, num = 0) {
        return this.getRecordEvents(event => event_packer_1.EventPacker.getIdentifier(event) === 137 /* DamageEvent */ && event.toId === player, undefined, current, inPhase, num);
    }
    getLostHpRecord(player, current, inPhase, num = 0) {
        return this.getRecordEvents(event => event_packer_1.EventPacker.getIdentifier(event) === 135 /* LoseHpEvent */ && event.toId === player, undefined, current, inPhase, num);
    }
    getCardUseRecord(player, current, inPhase, num = 0) {
        return this.getRecordEvents(event => event_packer_1.EventPacker.getIdentifier(event) === 124 /* CardUseEvent */ && event.fromId === player, undefined, current, inPhase, num);
    }
    getCardResponseRecord(player, current, inPhase, num = 0) {
        return this.getRecordEvents(event => event_packer_1.EventPacker.getIdentifier(event) === 123 /* CardResponseEvent */ && event.fromId === player, undefined, current, inPhase, num);
    }
    getCardLostRecord(player, current, inPhase, num = 0) {
        return this.getRecordEvents(event => event_packer_1.EventPacker.getIdentifier(event) === 128 /* MoveCardEvent */ &&
            event.infos.find(info => !(player === info.toId &&
                (info.toArea === 0 /* HandArea */ || info.toArea === 1 /* EquipArea */)) &&
                info.fromId === player &&
                info.movingCards.find(cardInfo => cardInfo.fromArea === 0 /* HandArea */ || cardInfo.fromArea === 1 /* EquipArea */) !== undefined) !== undefined, undefined, current, inPhase, num);
    }
    getCardObtainedRecord(player, current, inPhase, num = 0) {
        return this.getRecordEvents(event => event_packer_1.EventPacker.getIdentifier(event) === 128 /* MoveCardEvent */ &&
            event.infos.find(info => info.toId === player && info.toArea === 0 /* HandArea */) !== undefined, undefined, current, inPhase, num);
    }
    getCardDrawRecord(player, current, inPhase, num = 0) {
        return this.getRecordEvents(event => event_packer_1.EventPacker.getIdentifier(event) === 128 /* MoveCardEvent */ &&
            event.infos.find(info => info.toId === player && info.moveReason === 0 /* CardDraw */) !== undefined, undefined, current, inPhase, num);
    }
    getCardDropRecord(player, current, inPhase, num = 0) {
        return this.getRecordEvents(event => event_packer_1.EventPacker.getIdentifier(event) === 128 /* MoveCardEvent */ &&
            event.infos.find(info => info.fromId === player &&
                (info.moveReason === 4 /* SelfDrop */ || info.moveReason === 5 /* PassiveDrop */)) !== undefined, undefined, current, inPhase, num);
    }
    getCardMoveRecord(player, current, inPhase, num = 0) {
        return this.getRecordEvents(event => event_packer_1.EventPacker.getIdentifier(event) === 128 /* MoveCardEvent */ &&
            event.infos.find(info => info.proposer === player) !== undefined, undefined, current, inPhase, num);
    }
    getRecoveredHp(player, current, inPhase, num = 0) {
        return this.getRecoveredHpRecord(player, current, inPhase, num).reduce((totalAmount, event) => {
            totalAmount += event.recoveredHp;
            return totalAmount;
        }, 0);
    }
    getDamage(player, current, inPhase, num = 0) {
        return this.getDamageRecord(player, current, inPhase, num).reduce((totalAmount, event) => {
            totalAmount += event.damage;
            return totalAmount;
        }, 0);
    }
    getDamaged(player, current, inPhase, num = 0) {
        return this.getDamagedRecord(player, current, inPhase, num).reduce((totalAmount, event) => {
            totalAmount += event.damage;
            return totalAmount;
        }, 0);
    }
    getLostHp(player, current, inPhase, num = 0) {
        return this.getLostHpRecord(player, current, inPhase, num).reduce((totalAmount, event) => {
            totalAmount += event.lostHp;
            return totalAmount;
        }, 0);
    }
    getUsedCard(player, current, inPhase, num = 0) {
        return this.getCardUseRecord(player, current, inPhase, num).reduce((allCards, event) => {
            allCards.push(event.cardId);
            return allCards;
        }, []);
    }
    getResponsedCard(player, current, inPhase, num = 0) {
        return this.getCardResponseRecord(player, current, inPhase, num).reduce((allCards, event) => {
            allCards.push(event.cardId);
            return allCards;
        }, []);
    }
    getLostCard(player, current, inPhase, num = 0) {
        return this.getCardLostRecord(player, current, inPhase, num).reduce((allCards, event) => {
            if (event.infos.length === 1) {
                for (const cardInfo of event.infos[0].movingCards) {
                    if (cardInfo.asideMove) {
                        continue;
                    }
                    allCards.push(...card_1.VirtualCard.getActualCards([cardInfo.card]));
                }
            }
            else {
                const infos = event.infos.filter(info => !(player === info.toId &&
                    (info.toArea === 0 /* HandArea */ || info.toArea === 1 /* EquipArea */)) &&
                    info.fromId === player &&
                    info.movingCards.find(cardInfo => cardInfo.fromArea === 0 /* HandArea */ || cardInfo.fromArea === 1 /* EquipArea */) !== undefined);
                for (const info of infos) {
                    for (const cardInfo of info.movingCards) {
                        if (cardInfo.asideMove) {
                            continue;
                        }
                        allCards.push(...card_1.VirtualCard.getActualCards([cardInfo.card]));
                    }
                }
            }
            return allCards;
        }, []);
    }
    getObtainedCard(player, current, inPhase, num = 0) {
        return this.getCardObtainedRecord(player, current, inPhase, num).reduce((allCards, event) => {
            if (event.infos.length === 1) {
                for (const cardInfo of event.infos[0].movingCards) {
                    if (cardInfo.asideMove) {
                        continue;
                    }
                    allCards.push(...card_1.VirtualCard.getActualCards([cardInfo.card]));
                }
            }
            else {
                const infos = event.infos.filter(info => info.toId === player && info.toArea === 0 /* HandArea */);
                for (const info of infos) {
                    for (const cardInfo of info.movingCards) {
                        if (cardInfo.asideMove) {
                            continue;
                        }
                        allCards.push(...card_1.VirtualCard.getActualCards([cardInfo.card]));
                    }
                }
            }
            return allCards;
        }, []);
    }
    getDrawedCard(player, current, inPhase, num = 0) {
        return this.getCardDrawRecord(player, current, inPhase, num).reduce((allCards, event) => {
            if (event.infos.length === 1) {
                for (const cardInfo of event.infos[0].movingCards) {
                    if (cardInfo.asideMove) {
                        continue;
                    }
                    allCards.push(...card_1.VirtualCard.getActualCards([cardInfo.card]));
                }
            }
            else {
                const infos = event.infos.filter(info => event.infos.find(info => info.toId === player && info.moveReason === 0 /* CardDraw */) !== undefined);
                for (const info of infos) {
                    for (const cardInfo of info.movingCards) {
                        if (cardInfo.asideMove) {
                            continue;
                        }
                        allCards.push(...card_1.VirtualCard.getActualCards([cardInfo.card]));
                    }
                }
            }
            return allCards;
        }, []);
    }
    getDroppedCard(player, current, inPhase, num = 0) {
        return this.getCardDropRecord(player, current, inPhase, num).reduce((allCards, event) => {
            if (event.infos.length === 1) {
                for (const cardInfo of event.infos[0].movingCards) {
                    if (cardInfo.asideMove) {
                        continue;
                    }
                    allCards.push(...card_1.VirtualCard.getActualCards([cardInfo.card]));
                }
            }
            else {
                const infos = event.infos.filter(info => info.fromId === player &&
                    (info.moveReason === 4 /* SelfDrop */ || info.moveReason === 5 /* PassiveDrop */));
                for (const info of infos) {
                    for (const cardInfo of info.movingCards) {
                        if (cardInfo.asideMove) {
                            continue;
                        }
                        allCards.push(...card_1.VirtualCard.getActualCards([cardInfo.card]));
                    }
                }
            }
            return allCards;
        }, []);
    }
    getMovedCard(player, current, inPhase, num = 0) {
        return this.getCardMoveRecord(player, current, inPhase, num).reduce((allCards, event) => {
            if (event.infos.length === 1) {
                for (const cardInfo of event.infos[0].movingCards) {
                    if (cardInfo.asideMove) {
                        continue;
                    }
                    allCards.push(...card_1.VirtualCard.getActualCards([cardInfo.card]));
                }
            }
            else {
                const infos = event.infos.filter(info => info.proposer === player);
                for (const info of infos) {
                    for (const cardInfo of info.movingCards) {
                        if (cardInfo.asideMove) {
                            continue;
                        }
                        allCards.push(...card_1.VirtualCard.getActualCards([cardInfo.card]));
                    }
                }
            }
            return allCards;
        }, []);
    }
}
exports.RecordAnalytics = RecordAnalytics;
