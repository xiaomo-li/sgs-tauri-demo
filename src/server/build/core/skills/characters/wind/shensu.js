"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShenSu = void 0;
const tslib_1 = require("tslib");
const card_1 = require("core/cards/card");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
let ShenSu = class ShenSu extends skill_1.TriggerSkill {
    get RelatedCharacters() {
        return ['xiahouba'];
    }
    isTriggerable(event, stage) {
        return (stage === "BeforePhaseChange" /* BeforePhaseChange */ &&
            [2 /* JudgeStage */, 4 /* PlayCardStage */, 5 /* DropCardStage */].includes(event.to));
    }
    canUse(room, owner, content) {
        if (content.toPlayer !== owner.Id) {
            return false;
        }
        if (content.to === 4 /* PlayCardStage */) {
            room.setFlag(owner.Id, this.Name, content.to);
            return owner.getPlayerCards().length > 0;
        }
        else if (owner.getFlag(this.Name)) {
            room.removeFlag(owner.Id, this.Name);
        }
        return true;
    }
    targetFilter(room, owner, targets) {
        const availableNumOfTargets = 1;
        const additionalNumberOfTargets = this.additionalNumberOfTargets(room, owner, new card_matcher_1.CardMatcher({ generalName: ['slash'] }));
        if (additionalNumberOfTargets > 0) {
            return (targets.length >= availableNumOfTargets && targets.length <= availableNumOfTargets + additionalNumberOfTargets);
        }
        else {
            return targets.length === availableNumOfTargets;
        }
    }
    isAvailableTarget(owner, room, target) {
        return (owner !== target &&
            room.getPlayerById(owner).canUseCardTo(room, new card_matcher_1.CardMatcher({ generalName: ['slash'] }), target));
    }
    isAvailableCard(owner, room, cardId) {
        if (room.getPlayerById(owner).getFlag(this.Name) === 4 /* PlayCardStage */) {
            return engine_1.Sanguosha.getCardById(cardId).is(1 /* Equip */) && room.canDropCard(owner, cardId);
        }
        return false;
    }
    cardFilter(room, owner, cards) {
        if (owner.getFlag(this.Name) === 4 /* PlayCardStage */) {
            return cards.length === 1;
        }
        return cards.length === 0;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const { triggeredOnEvent, toIds, fromId, cardIds } = skillUseEvent;
        const phaseChangeEvent = triggeredOnEvent;
        room.endPhase(phaseChangeEvent.to);
        if (phaseChangeEvent.to === 2 /* JudgeStage */) {
            await room.skip(fromId, 3 /* DrawCardStage */);
        }
        if (phaseChangeEvent.to === 4 /* PlayCardStage */ && cardIds && cardIds.length > 0) {
            room.removeFlag(fromId, this.Name);
            await room.dropCards(4 /* SelfDrop */, cardIds, fromId, fromId, this.Name);
        }
        if (phaseChangeEvent.to === 5 /* DropCardStage */) {
            await room.turnOver(fromId);
        }
        const cardUseEvent = {
            fromId,
            targetGroup: toIds && [toIds],
            cardId: card_1.VirtualCard.create({ cardName: 'slash', bySkill: this.Name }).Id,
        };
        await room.useCard(cardUseEvent);
        return true;
    }
};
ShenSu = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'shensu', description: 'shensu_description' })
], ShenSu);
exports.ShenSu = ShenSu;
