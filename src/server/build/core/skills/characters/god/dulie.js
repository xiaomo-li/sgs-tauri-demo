"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DuLie = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const judge_matchers_1 = require("core/shares/libs/judge_matchers");
const aim_group_1 = require("core/shares/libs/utils/aim_group");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let DuLie = class DuLie extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "OnAimmed" /* OnAimmed */;
    }
    canUse(room, owner, content) {
        return (content.toId === owner.Id &&
            !room.getPlayerById(content.fromId).Dead &&
            room.getPlayerById(content.fromId).Hp > owner.Hp &&
            engine_1.Sanguosha.getCardById(content.byCardId).GeneralName === 'slash');
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        const aimEvent = event.triggeredOnEvent;
        const judgeEvent = await room.judge(fromId, undefined, this.Name, 11 /* DuLie */);
        if (judge_matchers_1.JudgeMatcher.onJudge(judgeEvent.judgeMatcherEnum, engine_1.Sanguosha.getCardById(judgeEvent.judgeCardId))) {
            aim_group_1.AimGroupUtil.cancelTarget(aimEvent, fromId);
        }
        return true;
    }
};
DuLie = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'dulie', description: 'dulie_description' })
], DuLie);
exports.DuLie = DuLie;
