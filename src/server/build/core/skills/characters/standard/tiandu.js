"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TianDu = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
let TianDu = class TianDu extends skill_1.TriggerSkill {
    get RelatedCharacters() {
        return ['xizhicai'];
    }
    isTriggerable(event, stage) {
        return stage === "AfterJudgeEffect" /* AfterJudgeEffect */;
    }
    canUse(room, owner, content) {
        return owner.Id === content.toId && room.isCardOnProcessing(content.judgeCardId);
    }
    async onTrigger(room, skillUseEvent) {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const { triggeredOnEvent } = skillUseEvent;
        const judgeEvent = triggeredOnEvent;
        await room.moveCards({
            movingCards: [{ card: judgeEvent.judgeCardId, fromArea: 6 /* ProcessingArea */ }],
            toArea: 0 /* HandArea */,
            toId: skillUseEvent.fromId,
            moveReason: 1 /* ActivePrey */,
            proposer: skillUseEvent.fromId,
            movedByReason: this.GeneralName,
        });
        return true;
    }
};
TianDu = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'tiandu', description: 'tiandu_description' })
], TianDu);
exports.TianDu = TianDu;
