"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YangWeiRemover = exports.YangWeiShadow = exports.YangWei = void 0;
const tslib_1 = require("tslib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const game_props_1 = require("core/game/game_props");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let YangWei = class YangWei extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return !owner.getFlag(this.Name);
    }
    cardFilter(room, owner, cards) {
        return cards.length === 0;
    }
    numberOfTargets() {
        return 0;
    }
    isAvailableTarget(owner, room, target) {
        return false;
    }
    isAvailableCard() {
        return false;
    }
    async onUse(room, event) {
        return true;
    }
    async onEffect(room, event) {
        await room.drawCards(2, event.fromId, 'top', event.fromId, this.Name);
        room.setFlag(event.fromId, this.Name, true);
        room.getPlayerById(event.fromId).setFlag(YangWeiRemover.Name, true);
        return true;
    }
};
YangWei = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'yangwei', description: 'yangwei_description' })
], YangWei);
exports.YangWei = YangWei;
let YangWeiShadow = class YangWeiShadow extends skill_1.RulesBreakerSkill {
    afterLosingSkill(room, owner) {
        return !room.getPlayerById(owner).getFlag(this.GeneralName);
    }
    breakCardUsableTimes(cardId, room, owner) {
        if (!owner.getFlag(this.GeneralName)) {
            return 0;
        }
        if (cardId instanceof card_matcher_1.CardMatcher) {
            return cardId.match(new card_matcher_1.CardMatcher({ generalName: ['slash'] })) ? 1 : 0;
        }
        else {
            return engine_1.Sanguosha.getCardById(cardId).GeneralName === 'slash' ? 1 : 0;
        }
    }
    breakCardUsableDistance(cardId, room, owner) {
        if (!owner.getFlag(this.GeneralName)) {
            return 0;
        }
        if (cardId instanceof card_matcher_1.CardMatcher) {
            return cardId.match(new card_matcher_1.CardMatcher({ generalName: ['slash'] })) ? game_props_1.INFINITE_DISTANCE : 0;
        }
        else {
            return engine_1.Sanguosha.getCardById(cardId).GeneralName === 'slash' ? game_props_1.INFINITE_DISTANCE : 0;
        }
    }
};
YangWeiShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: YangWei.Name, description: YangWei.Description })
], YangWeiShadow);
exports.YangWeiShadow = YangWeiShadow;
let YangWeiRemover = class YangWeiRemover extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner) {
        return !!room.getPlayerById(owner).getFlag(this.GeneralName);
    }
    isAutoTrigger() {
        return true;
    }
    isFlaggedSkill(room, event, stage) {
        return stage !== "StageChanged" /* StageChanged */;
    }
    isTriggerable(event, stage) {
        return (stage === "BeforeCardUseEffect" /* BeforeCardUseEffect */ ||
            stage === "StageChanged" /* StageChanged */ ||
            stage === "PhaseChanged" /* PhaseChanged */);
    }
    canUse(room, owner, event) {
        const identifier = event_packer_1.EventPacker.getIdentifier(event);
        if (identifier === 124 /* CardUseEvent */) {
            const cardUseEvent = event;
            return (cardUseEvent.fromId === owner.Id &&
                engine_1.Sanguosha.getCardById(cardUseEvent.cardId).GeneralName === 'slash' &&
                owner.getFlag(this.GeneralName));
        }
        else if (identifier === 105 /* PhaseStageChangeEvent */) {
            const phaseStageChangeEvent = event;
            return (phaseStageChangeEvent.playerId === owner.Id &&
                phaseStageChangeEvent.toStage === 19 /* FinishStageStart */ &&
                owner.getFlag(this.GeneralName) &&
                !owner.getFlag(this.Name));
        }
        else if (identifier === 104 /* PhaseChangeEvent */) {
            const phaseChangeEvent = event;
            return (phaseChangeEvent.from === 7 /* PhaseFinish */ &&
                phaseChangeEvent.fromPlayer === owner.Id &&
                (owner.getFlag(this.GeneralName) || owner.getFlag(this.Name)));
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const unknownEvent = event.triggeredOnEvent;
        const identifier = event_packer_1.EventPacker.getIdentifier(unknownEvent);
        if (identifier === 124 /* CardUseEvent */) {
            const cardUseEvent = event.triggeredOnEvent;
            cardUseEvent.triggeredBySkills = cardUseEvent.triggeredBySkills || [];
            cardUseEvent.triggeredBySkills.push(this.GeneralName);
        }
        else if (identifier === 105 /* PhaseStageChangeEvent */) {
            room.removeFlag(event.fromId, this.GeneralName);
        }
        else {
            room.getPlayerById(event.fromId).removeFlag(this.Name);
        }
        return true;
    }
};
YangWeiRemover = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: YangWeiShadow.Name, description: YangWeiShadow.Description })
], YangWeiRemover);
exports.YangWeiRemover = YangWeiRemover;
