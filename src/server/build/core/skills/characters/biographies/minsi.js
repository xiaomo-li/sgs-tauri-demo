"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MinSiUnlimited = exports.MinSiShadow = exports.MinSi = void 0;
const tslib_1 = require("tslib");
const card_1 = require("core/cards/card");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const game_props_1 = require("core/game/game_props");
const precondition_1 = require("core/shares/libs/precondition/precondition");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let MinSi = class MinSi extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return !owner.hasUsedSkill(this.Name) && owner.getPlayerCards().length > 0;
    }
    numberOfTargets() {
        return 0;
    }
    isAvailableTarget() {
        return false;
    }
    cardFilter(room, owner, cards) {
        return (cards.length > 0 && cards.reduce((sum, id) => (sum += engine_1.Sanguosha.getCardById(id).CardNumber), 0) === 13);
    }
    isAvailableCard(owner, room, cardId, selectedCards) {
        if (!room.canDropCard(owner, cardId)) {
            return false;
        }
        if (selectedCards.length > 0) {
            return (engine_1.Sanguosha.getCardById(cardId).CardNumber <=
                13 - selectedCards.reduce((sum, id) => (sum += engine_1.Sanguosha.getCardById(id).CardNumber), 0));
        }
        return engine_1.Sanguosha.getCardById(cardId).CardNumber <= 13;
    }
    async onUse() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        const cardIds = precondition_1.Precondition.exists(event.cardIds, 'Unable to get minsi cards');
        await room.dropCards(4 /* SelfDrop */, cardIds, fromId, fromId, this.Name);
        const cards = await room.drawCards(cardIds.length * 2, fromId, 'top', fromId, this.Name);
        room.setCardTag(fromId, this.Name, card_1.VirtualCard.getActualCards(cards));
        return true;
    }
};
MinSi = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'minsi', description: 'minsi_description' })
], MinSi);
exports.MinSi = MinSi;
let MinSiShadow = class MinSiShadow extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    get Muted() {
        return true;
    }
    isAutoTrigger() {
        return true;
    }
    isTriggerable(event, stage) {
        return (event_packer_1.EventPacker.getIdentifier(event) === 162 /* AskForCardDropEvent */ ||
            stage === "PhaseChanged" /* PhaseChanged */);
    }
    isFlaggedSkill(room, event, stage) {
        return true;
    }
    canUse(room, owner, content) {
        let canTrigger = false;
        if (event_packer_1.EventPacker.getIdentifier(content) === 162 /* AskForCardDropEvent */) {
            canTrigger = room.CurrentPlayerPhase === 5 /* DropCardStage */ && room.CurrentPhasePlayer.Id === owner.Id;
        }
        else if (event_packer_1.EventPacker.getIdentifier(content) === 104 /* PhaseChangeEvent */) {
            const phaseChangeEvent = content;
            canTrigger = phaseChangeEvent.from === 7 /* PhaseFinish */;
        }
        return canTrigger && owner.getCardTag(this.GeneralName) !== undefined;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const unknownEvent = event.triggeredOnEvent;
        const identifier = event_packer_1.EventPacker.getIdentifier(unknownEvent);
        if (identifier === 162 /* AskForCardDropEvent */) {
            const askForCardDropEvent = unknownEvent;
            const player = room.getPlayerById(askForCardDropEvent.toId);
            const cardIds = player.getCardTag(this.GeneralName);
            if (cardIds && cardIds.length > 0) {
                const hands = player.getCardIds(0 /* HandArea */);
                const minSiCards = hands.filter(card => cardIds.includes(card_1.VirtualCard.getActualCards([card])[0]) &&
                    engine_1.Sanguosha.getCardById(card).Color === 0 /* Red */);
                const discardAmount = hands.length - minSiCards.length - player.getMaxCardHold(room);
                askForCardDropEvent.cardAmount = discardAmount;
                askForCardDropEvent.except = askForCardDropEvent.except
                    ? [...askForCardDropEvent.except, ...minSiCards]
                    : minSiCards;
            }
        }
        else if (identifier === 104 /* PhaseChangeEvent */) {
            room.removeCardTag(event.fromId, this.GeneralName);
        }
        return true;
    }
};
MinSiShadow = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_1.CommonSkill({ name: MinSi.Name, description: MinSi.Description })
], MinSiShadow);
exports.MinSiShadow = MinSiShadow;
let MinSiUnlimited = class MinSiUnlimited extends skill_1.RulesBreakerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    breakCardUsableDistance(cardId, room, owner) {
        if (!room.getCardTag(owner.Id, this.GeneralName) || cardId instanceof card_matcher_1.CardMatcher) {
            return 0;
        }
        if (room.getCardTag(owner.Id, this.GeneralName).includes(cardId) &&
            engine_1.Sanguosha.getCardById(cardId).Color === 1 /* Black */) {
            return game_props_1.INFINITE_DISTANCE;
        }
        else {
            return 0;
        }
    }
};
MinSiUnlimited = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_1.CommonSkill({ name: MinSiShadow.Name, description: MinSiShadow.Description })
], MinSiUnlimited);
exports.MinSiUnlimited = MinSiUnlimited;
