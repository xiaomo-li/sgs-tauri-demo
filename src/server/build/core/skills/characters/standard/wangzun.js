"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WangZunShadow = exports.WangZun = void 0;
const tslib_1 = require("tslib");
const precondition_1 = require("core/shares/libs/precondition/precondition");
const skill_1 = require("core/skills/skill");
let WangZun = class WangZun extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        return (3 /* PrepareStageStart */ === content.toStage && room.getPlayerById(content.playerId).Hp > owner.Hp);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const { triggeredOnEvent } = skillUseEvent;
        const phaseStageChangeEvent = triggeredOnEvent;
        if (room.getPlayerById(phaseStageChangeEvent.playerId).Role === 1 /* Lord */) {
            await room.drawCards(2, skillUseEvent.fromId, undefined, skillUseEvent.fromId, this.Name);
            room.syncGameCommonRules(phaseStageChangeEvent.playerId, user => {
                user.addInvisibleMark(this.Name, 1);
                room.CommonRules.addAdditionalHoldCardNumber(user, -1);
            });
        }
        else {
            await room.drawCards(1, skillUseEvent.fromId, undefined, skillUseEvent.fromId, this.Name);
        }
        return true;
    }
};
WangZun = tslib_1.__decorate([
    skill_1.CompulsorySkill({ name: 'wangzun', description: 'wangzun_description' })
], WangZun);
exports.WangZun = WangZun;
let WangZunShadow = class WangZunShadow extends skill_1.TriggerSkill {
    afterDead(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    isTriggerable(event, stage) {
        return stage === "PhaseChanged" /* PhaseChanged */;
    }
    isFlaggedSkill() {
        return true;
    }
    canUse(room, owner, content) {
        if (7 /* PhaseFinish */ !== content.from || !content.fromPlayer) {
            return false;
        }
        const lord = room.getPlayerById(content.fromPlayer);
        return lord.Role === 1 /* Lord */ && lord.getInvisibleMark(this.GeneralName) > 0;
    }
    async onTrigger(room, event) {
        return true;
    }
    async onEffect(room, event) {
        const { triggeredOnEvent } = event;
        const phaseChangeEvent = precondition_1.Precondition.exists(triggeredOnEvent, 'Unknown phase change event in wangzun');
        room.syncGameCommonRules(phaseChangeEvent.fromPlayer, user => {
            const extraHold = user.getInvisibleMark(this.GeneralName);
            user.removeInvisibleMark(this.GeneralName);
            room.CommonRules.addAdditionalHoldCardNumber(user, extraHold);
        });
        return true;
    }
};
WangZunShadow = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.CompulsorySkill({ name: WangZun.Name, description: WangZun.Description })
], WangZunShadow);
exports.WangZunShadow = WangZunShadow;
