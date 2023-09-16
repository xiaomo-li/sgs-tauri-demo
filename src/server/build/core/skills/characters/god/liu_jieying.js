"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiuJieYingBuff = exports.LiuJieYing = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
let LiuJieYing = class LiuJieYing extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return (stage === "AfterGameBegan" /* AfterGameBegan */ ||
            stage === "StageChanged" /* StageChanged */ ||
            stage === "BeforeChainingOn" /* BeforeChainingOn */);
    }
    canUse(room, owner, content) {
        const identifier = event_packer_1.EventPacker.getIdentifier(content);
        if (identifier === 105 /* PhaseStageChangeEvent */) {
            const phaseStageChangeEvent = content;
            return (phaseStageChangeEvent.playerId === owner.Id &&
                phaseStageChangeEvent.toStage === 19 /* FinishStageStart */ &&
                room.getOtherPlayers(owner.Id).find(player => !player.ChainLocked) !== undefined);
        }
        else if (identifier === 119 /* ChainLockedEvent */) {
            const chainLockedEvent = content;
            return chainLockedEvent.toId === owner.Id && chainLockedEvent.linked === false;
        }
        return identifier === 143 /* GameBeginEvent */ && !owner.ChainLocked;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, triggeredOnEvent } = event;
        const unknownEvent = triggeredOnEvent;
        const identifier = event_packer_1.EventPacker.getIdentifier(unknownEvent);
        if (identifier === 105 /* PhaseStageChangeEvent */) {
            const targets = room
                .getOtherPlayers(fromId)
                .filter(player => !player.ChainLocked)
                .map(player => player.Id);
            if (targets.length === 0) {
                return false;
            }
            const resp = await room.doAskForCommonly(167 /* AskForChoosingPlayerEvent */, event_packer_1.EventPacker.createUncancellableEvent({
                players: targets,
                toId: fromId,
                requiredAmount: 1,
                conversation: 'liu_jieying: please choose a target to chain on',
                triggeredBySkills: [this.Name],
            }), fromId);
            resp.selectedPlayers = resp.selectedPlayers || [targets[0]];
            await room.chainedOn(resp.selectedPlayers[0]);
        }
        else if (identifier === 119 /* ChainLockedEvent */) {
            event_packer_1.EventPacker.terminate(unknownEvent);
        }
        else {
            await room.chainedOn(fromId);
        }
        return true;
    }
};
LiuJieYing = tslib_1.__decorate([
    skill_1.CompulsorySkill({ name: 'liu_jieying', description: 'liu_jieying_description' })
], LiuJieYing);
exports.LiuJieYing = LiuJieYing;
let LiuJieYingBuff = class LiuJieYingBuff extends skill_1.GlobalRulesBreakerSkill {
    breakAdditionalCardHold(room, owner, target) {
        return target.ChainLocked ? 2 : 0;
    }
};
LiuJieYingBuff = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.CompulsorySkill({ name: LiuJieYing.Name, description: LiuJieYing.Description })
], LiuJieYingBuff);
exports.LiuJieYingBuff = LiuJieYingBuff;
