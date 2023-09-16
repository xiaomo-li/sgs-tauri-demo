"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JiJie = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
let JiJie = class JiJie extends skill_1.ActiveSkill {
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
    async onEffect(room, skillUseEvent) {
        const displayCards = room.getCards(1, 'bottom');
        const observeCardsEvent = {
            cardIds: displayCards,
            selected: [],
        };
        room.notify(129 /* ObserveCardsEvent */, observeCardsEvent, skillUseEvent.fromId);
        const choosePlayerEvent = {
            players: room.getAlivePlayersFrom().map(p => p.Id),
            toId: skillUseEvent.fromId,
            requiredAmount: 1,
            conversation: 'jijie:Please choose a target to obtain the card you show',
            triggeredBySkills: [this.Name],
        };
        room.notify(167 /* AskForChoosingPlayerEvent */, choosePlayerEvent, skillUseEvent.fromId);
        const choosePlayerResponse = await room.onReceivingAsyncResponseFrom(167 /* AskForChoosingPlayerEvent */, skillUseEvent.fromId);
        const target = choosePlayerResponse.selectedPlayers === undefined
            ? skillUseEvent.fromId
            : choosePlayerResponse.selectedPlayers[0];
        room.notify(130 /* ObserveCardFinishEvent */, {}, skillUseEvent.fromId);
        await room.moveCards({
            movingCards: displayCards.map(card => ({ card, fromArea: 6 /* ProcessingArea */ })),
            toId: target,
            toArea: 0 /* HandArea */,
            moveReason: 1 /* ActivePrey */,
            proposer: skillUseEvent.fromId,
            movedByReason: this.Name,
            engagedPlayerIds: [target],
        });
        return true;
    }
};
JiJie = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'jijie', description: 'jijie_description' })
], JiJie);
exports.JiJie = JiJie;
