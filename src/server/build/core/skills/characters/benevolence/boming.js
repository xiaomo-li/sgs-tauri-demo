"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoMingShadow = exports.BoMing = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let BoMing = class BoMing extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return owner.hasUsedSkillTimes(this.Name) < 2;
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, target) {
        return target !== owner;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    isAvailableCard(owner, room, cardId) {
        return true;
    }
    async onUse() {
        return true;
    }
    async onEffect(room, event) {
        if (!event.toIds || !event.cardIds) {
            return false;
        }
        await room.moveCards({
            movingCards: [{ card: event.cardIds[0], fromArea: room.getPlayerById(event.fromId).cardFrom(event.cardIds[0]) }],
            fromId: event.fromId,
            toId: event.toIds[0],
            toArea: 0 /* HandArea */,
            moveReason: 2 /* ActiveMove */,
            proposer: event.fromId,
            triggeredBySkills: [this.Name],
        });
        if (room.getFlag(event.fromId, this.Name) === undefined) {
            room.getPlayerById(event.fromId).hasUsedSkillTimes(this.Name) === 2 &&
                room.getPlayerById(event.fromId).setFlag(this.Name, true);
        }
        return true;
    }
};
BoMing = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'boming', description: 'boming_description' })
], BoMing);
exports.BoMing = BoMing;
let BoMingShadow = class BoMingShadow extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner) {
        return room.getFlag(owner, this.GeneralName) === undefined;
    }
    async whenDead(room, player) {
        player.removeFlag(this.GeneralName);
    }
    isAutoTrigger() {
        return true;
    }
    isFlaggedSkill(room, event, stage) {
        return stage === "PhaseChanged" /* PhaseChanged */;
    }
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */ || stage === "PhaseChanged" /* PhaseChanged */;
    }
    canUse(room, owner, event, stage) {
        if (owner.getFlag(this.GeneralName) === undefined) {
            return false;
        }
        const identifier = event_packer_1.EventPacker.getIdentifier(event);
        if (identifier === 105 /* PhaseStageChangeEvent */) {
            const phaseStageChangeEvent = event;
            return (phaseStageChangeEvent.playerId === owner.Id &&
                phaseStageChangeEvent.toStage === 19 /* FinishStageStart */ &&
                owner.getFlag(this.GeneralName));
        }
        else if (identifier === 104 /* PhaseChangeEvent */) {
            const phaseChangeEvent = event;
            return phaseChangeEvent.fromPlayer === owner.Id && phaseChangeEvent.from === 7 /* PhaseFinish */;
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const unknownEvent = event.triggeredOnEvent;
        const identifier = event_packer_1.EventPacker.getIdentifier(unknownEvent);
        if (identifier === 105 /* PhaseStageChangeEvent */) {
            await room.drawCards(1, event.fromId, 'top', event.fromId, this.GeneralName);
        }
        room.getPlayerById(event.fromId).removeFlag(this.GeneralName);
        return true;
    }
};
BoMingShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: BoMing.Name, description: BoMing.Description })
], BoMingShadow);
exports.BoMingShadow = BoMingShadow;
