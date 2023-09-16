"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LuoShenShadow = exports.LuoShen = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const judge_matchers_1 = require("core/shares/libs/judge_matchers");
const skill_1 = require("core/skills/skill");
let LuoShen = class LuoShen extends skill_1.TriggerSkill {
    isAutoTrigger(room, owner, event) {
        const identifier = event_packer_1.EventPacker.getIdentifier(event);
        return identifier === 140 /* JudgeEvent */;
    }
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */ || stage === "AfterJudgeEffect" /* AfterJudgeEffect */;
    }
    canUse(room, owner, content) {
        const identifier = event_packer_1.EventPacker.getIdentifier(content);
        if (identifier === 105 /* PhaseStageChangeEvent */) {
            content = content;
            return owner.Id === content.playerId && 4 /* PrepareStage */ === content.toStage;
        }
        else if (identifier === 140 /* JudgeEvent */) {
            content = content;
            return (owner.Id === content.toId &&
                content.bySkill === this.GeneralName &&
                room.isCardOnProcessing(content.judgeCardId));
        }
        return false;
    }
    async onTrigger(room, event) {
        const { triggeredOnEvent } = event;
        const identifier = triggeredOnEvent && event_packer_1.EventPacker.getIdentifier(triggeredOnEvent);
        if (identifier === 140 /* JudgeEvent */) {
            event.translationsMessage = undefined;
        }
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const { triggeredOnEvent } = skillUseEvent;
        const identifier = triggeredOnEvent && event_packer_1.EventPacker.getIdentifier(triggeredOnEvent);
        if (identifier === 105 /* PhaseStageChangeEvent */) {
            do {
                const judge = await room.judge(skillUseEvent.fromId, undefined, this.Name, 7 /* LuoShen */);
                if (judge_matchers_1.JudgeMatcher.onJudge(7 /* LuoShen */, engine_1.Sanguosha.getCardById(judge.judgeCardId))) {
                    room.notify(171 /* AskForSkillUseEvent */, {
                        invokeSkillNames: [this.Name],
                        toId: skillUseEvent.fromId,
                    }, skillUseEvent.fromId);
                    const { invoke } = await room.onReceivingAsyncResponseFrom(171 /* AskForSkillUseEvent */, skillUseEvent.fromId);
                    if (!invoke) {
                        break;
                    }
                }
                else {
                    break;
                }
            } while (true);
        }
        else if (identifier === 140 /* JudgeEvent */) {
            const judgeEvent = triggeredOnEvent;
            const player = room.getPlayerById(skillUseEvent.fromId);
            const luoshenCards = player.getFlag(this.Name) || [];
            luoshenCards.push(judgeEvent.judgeCardId);
            player.setFlag(this.Name, luoshenCards);
            if (engine_1.Sanguosha.getCardById(judgeEvent.judgeCardId).isBlack()) {
                await room.moveCards({
                    movingCards: [{ card: judgeEvent.judgeCardId, fromArea: 6 /* ProcessingArea */ }],
                    moveReason: 1 /* ActivePrey */,
                    toId: skillUseEvent.fromId,
                    toArea: 0 /* HandArea */,
                    movedByReason: this.Name,
                });
                const originalLuoShenCards = room.getCardTag(skillUseEvent.fromId, this.Name) || [];
                originalLuoShenCards.push(judgeEvent.judgeCardId);
                room.setCardTag(skillUseEvent.fromId, this.Name, originalLuoShenCards);
            }
        }
        return true;
    }
};
LuoShen = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'luoshen', description: 'luoshen_description' })
], LuoShen);
exports.LuoShen = LuoShen;
let LuoShenShadow = class LuoShenShadow extends skill_1.TriggerSkill {
    isTriggerable(event) {
        return event_packer_1.EventPacker.getIdentifier(event) === 162 /* AskForCardDropEvent */;
    }
    canUse(room, owner) {
        return room.CurrentPlayerPhase === 5 /* DropCardStage */ && room.CurrentPhasePlayer.Id === owner.Id;
    }
    isFlaggedSkill(room, event, stage) {
        return true;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { triggeredOnEvent } = event;
        const askForCardDropEvent = triggeredOnEvent;
        const player = room.getPlayerById(askForCardDropEvent.toId);
        const luoshenCards = player.getFlag(this.GeneralName) || [];
        player.removeFlag(this.GeneralName);
        room.removeCardTag(askForCardDropEvent.toId, this.GeneralName);
        const otherHandCards = player.getCardIds(0 /* HandArea */).filter(card => !luoshenCards.includes(card));
        const discardAmount = otherHandCards.length - player.getMaxCardHold(room);
        askForCardDropEvent.cardAmount = discardAmount;
        askForCardDropEvent.except = askForCardDropEvent.except
            ? [...askForCardDropEvent.except, ...luoshenCards]
            : luoshenCards;
        return true;
    }
};
LuoShenShadow = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.CompulsorySkill({ name: 'luoshen', description: 'luoshen_description' })
], LuoShenShadow);
exports.LuoShenShadow = LuoShenShadow;
