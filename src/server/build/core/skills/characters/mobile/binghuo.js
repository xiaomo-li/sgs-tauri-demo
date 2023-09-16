"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BingHuo = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const judge_matchers_1 = require("core/shares/libs/judge_matchers");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
const jibing_1 = require("./jibing");
let BingHuo = class BingHuo extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        return (content.toStage === 19 /* FinishStageStart */ &&
            room.Analytics.getRecordEvents(event => (event_packer_1.EventPacker.getIdentifier(event) === 124 /* CardUseEvent */ ||
                event_packer_1.EventPacker.getIdentifier(event) === 123 /* CardResponseEvent */) &&
                engine_1.Sanguosha.getCardById(event.cardId).isVirtualCard() &&
                engine_1.Sanguosha.getCardById(event.cardId).findByGeneratedSkill(jibing_1.JiBing.Name), undefined, 'round', undefined, 1).length > 0);
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget() {
        return true;
    }
    getSkillLog() {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to choose a target to judge, and if the result’s color is black, you deal 1 thunder damage to the target?', this.Name).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        if (!event.toIds) {
            return false;
        }
        const judgeEvent = await room.judge(event.toIds[0], undefined, this.Name, 14 /* BingHuo */);
        if (judge_matchers_1.JudgeMatcher.onJudge(judgeEvent.judgeMatcherEnum, engine_1.Sanguosha.getCardById(judgeEvent.judgeCardId))) {
            await room.damage({
                fromId: event.fromId,
                toId: event.toIds[0],
                damage: 1,
                damageType: "thunder_property" /* Thunder */,
                triggeredBySkills: [this.Name],
            });
        }
        return true;
    }
};
BingHuo = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'binghuo', description: 'binghuo_description' })
], BingHuo);
exports.BingHuo = BingHuo;
