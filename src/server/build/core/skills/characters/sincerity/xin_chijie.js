"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XinChiJie = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const judge_matchers_1 = require("core/shares/libs/judge_matchers");
const aim_group_1 = require("core/shares/libs/utils/aim_group");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let XinChiJie = class XinChiJie extends skill_1.TriggerSkill {
    isRefreshAt(room, owner, stage) {
        return stage === 0 /* PhaseBegin */;
    }
    isTriggerable(event, stage) {
        return stage === "OnAimmed" /* OnAimmed */;
    }
    canUse(room, owner, event) {
        return (event.fromId !== owner.Id &&
            event.toId === owner.Id &&
            !owner.hasUsedSkill(this.Name) &&
            aim_group_1.AimGroupUtil.getAllTargets(event.allTargets).length === 1);
    }
    getSkillLog(room, owner, event) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to use this skill to {1} which {2} used?', this.Name, translation_json_tool_1.TranslationPack.patchCardInTranslation(event.byCardId), translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(event.fromId))).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const judgeEvent = await room.judge(event.fromId, undefined, this.Name, 15 /* XinChiJie */);
        judge_matchers_1.JudgeMatcher.onJudge(judgeEvent.judgeMatcherEnum, engine_1.Sanguosha.getCardById(judgeEvent.judgeCardId)) &&
            aim_group_1.AimGroupUtil.cancelTarget(event.triggeredOnEvent, event.fromId);
        return true;
    }
};
XinChiJie = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'xin_chijie', description: 'xin_chijie_description' })
], XinChiJie);
exports.XinChiJie = XinChiJie;
