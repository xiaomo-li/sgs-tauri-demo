"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShanXiClear = exports.ShanXi = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const algorithm_1 = require("core/shares/libs/algorithm");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let ShanXi = class ShanXi extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        return (content.playerId === owner.Id &&
            content.toStage === 13 /* PlayCardStageStart */ &&
            owner.getCardIds(0 /* HandArea */).length > 0);
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableCard(owner, room, cardId) {
        return engine_1.Sanguosha.getCardById(cardId).isRed() && engine_1.Sanguosha.getCardById(cardId).is(0 /* Basic */);
    }
    isAvailableTarget(owner, room, target) {
        return target !== owner && room.getPlayerById(target).getPlayerCards().length > 0;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        if (!event.toIds || !event.cardIds) {
            return false;
        }
        await room.dropCards(4 /* SelfDrop */, event.cardIds, event.fromId, event.fromId, this.Name);
        const toId = event.toIds[0];
        const to = room.getPlayerById(toId);
        const handCardIds = to.getCardIds(0 /* HandArea */);
        const equipCardIds = to.getCardIds(1 /* EquipArea */);
        const { selectedCards, selectedCardsIndex } = await room.doAskForCommonly(166 /* AskForChoosingCardWithConditionsEvent */, {
            toId,
            customCardFields: {
                [0 /* HandArea */]: handCardIds.length,
                [1 /* EquipArea */]: equipCardIds,
            },
            customTitle: this.Name,
            amount: [1, room.getPlayerById(event.fromId).Hp],
            triggeredBySkills: [this.Name],
        }, event.fromId, true);
        const movingCards = selectedCards
            ? selectedCards.map(id => ({ card: id, fromArea: to.cardFrom(id) }))
            : [];
        for (const card of selectedCardsIndex ? algorithm_1.Algorithm.randomPick(selectedCardsIndex.length, handCardIds) : []) {
            movingCards.push({ card, fromArea: 0 /* HandArea */ });
        }
        await room.moveCards({
            movingCards,
            fromId: to.Id,
            toId: to.Id,
            toArea: 3 /* OutsideArea */,
            moveReason: 3 /* PassiveMove */,
            proposer: event.fromId,
            toOutsideArea: this.GeneralName,
            movedByReason: this.GeneralName,
        });
        return true;
    }
};
ShanXi = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'shanxi', description: 'shanxi_description' })
], ShanXi);
exports.ShanXi = ShanXi;
let ShanXiClear = class ShanXiClear extends skill_1.TriggerSkill {
    async shanxiClear(room) {
        for (const player of room.getAlivePlayersFrom()) {
            const shanxiCard = player.getCardIds(3 /* OutsideArea */, this.GeneralName);
            if (shanxiCard.length) {
                await room.moveCards({
                    movingCards: shanxiCard.map(id => ({ card: id, fromArea: 3 /* OutsideArea */ })),
                    fromId: player.Id,
                    toId: player.Id,
                    toArea: 0 /* HandArea */,
                    moveReason: 1 /* ActivePrey */,
                    proposer: player.Id,
                    movedByReason: this.GeneralName,
                });
            }
        }
    }
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    afterDead(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    async whenDead(room, player) {
        if (room.CurrentPhasePlayer === player) {
            await this.shanxiClear(room);
        }
    }
    isTriggerable(event, stage) {
        return stage === "PhaseChanged" /* PhaseChanged */;
    }
    isAutoTrigger() {
        return true;
    }
    isFlaggedSkill() {
        return true;
    }
    canUse(room, owner, event) {
        return event.from === 7 /* PhaseFinish */;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room) {
        await this.shanxiClear(room);
        return true;
    }
};
ShanXiClear = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: ShanXi.Name, description: ShanXi.Description })
], ShanXiClear);
exports.ShanXiClear = ShanXiClear;
