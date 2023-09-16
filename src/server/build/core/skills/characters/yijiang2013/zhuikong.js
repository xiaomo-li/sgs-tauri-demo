"use strict";
var ZhuiKong_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZhuiKongDistance = exports.ZhuiKongFilter = exports.ZhuiKong = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let ZhuiKong = ZhuiKong_1 = class ZhuiKong extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    isRefreshAt(room, owner, phase) {
        return room.CurrentPhasePlayer === owner && phase === 6 /* FinishStage */;
    }
    whenRefresh(room, owner) {
        for (const player of room.getOtherPlayers(owner.Id)) {
            player.getFlag(ZhuiKong_1.Filter) && room.removeFlag(player.Id, ZhuiKong_1.Filter);
            player.getFlag(ZhuiKong_1.DistanceBreak) && room.removeFlag(player.Id, ZhuiKong_1.DistanceBreak);
        }
    }
    isTriggerable(_, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, event) {
        return (event.toStage === 3 /* PrepareStageStart */ &&
            owner.isInjured() &&
            room.canPindian(owner.Id, event.playerId));
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillEffectEvent) {
        const { fromId, triggeredOnEvent } = skillEffectEvent;
        const { playerId } = triggeredOnEvent;
        const to = room.getPlayerById(playerId);
        const { pindianRecord } = await room.pindian(fromId, [playerId], this.Name);
        if (!pindianRecord) {
            return false;
        }
        if (pindianRecord[0].winner === fromId) {
            room.setFlag(to.Id, ZhuiKong_1.Filter, true);
        }
        else {
            room.setFlag(to.Id, ZhuiKong_1.DistanceBreak, true);
        }
        return true;
    }
};
ZhuiKong.Filter = 'qiuyuan_filter';
ZhuiKong.DistanceBreak = 'distance_break';
ZhuiKong = ZhuiKong_1 = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'zhuikong', description: 'zhuikong_description' })
], ZhuiKong);
exports.ZhuiKong = ZhuiKong;
let ZhuiKongFilter = class ZhuiKongFilter extends skill_1.GlobalFilterSkill {
    canUseCardTo(_, __, ___, from, to) {
        return !from.getFlag(ZhuiKong.Filter) || to.Id === from.Id;
    }
};
ZhuiKongFilter = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: ZhuiKong.Name, description: ZhuiKong.Description })
], ZhuiKongFilter);
exports.ZhuiKongFilter = ZhuiKongFilter;
let ZhuiKongDistance = class ZhuiKongDistance extends skill_1.GlobalRulesBreakerSkill {
    breakDistance(_, owner, from, to) {
        return from.getFlag(ZhuiKong.DistanceBreak) && to.Id === owner.Id ? 1 : 0;
    }
};
ZhuiKongDistance = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: ZhuiKongFilter.Name, description: ZhuiKongFilter.Description })
], ZhuiKongDistance);
exports.ZhuiKongDistance = ZhuiKongDistance;
