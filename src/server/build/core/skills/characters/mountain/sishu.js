"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SiShuShadow = exports.SiShu = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let SiShu = class SiShu extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        return content.toStage === 13 /* PlayCardStageStart */ && content.playerId === owner.Id;
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget() {
        return true;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillEffectEvent) {
        const { toIds } = skillEffectEvent;
        const toId = toIds[0];
        if (room.getFlag(toId, this.Name) === true) {
            room.removeFlag(toId, this.Name);
        }
        else {
            room.setFlag(toIds[0], this.Name, true, this.Name);
        }
        return true;
    }
};
SiShu = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'sishu', description: 'sishu_description' })
], SiShu);
exports.SiShu = SiShu;
let SiShuShadow = class SiShuShadow extends skill_1.TriggerSkill {
    isAutoTrigger() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "OnJudge" /* OnJudge */;
    }
    canUse(room, owner, content) {
        return (content.byCard !== undefined &&
            engine_1.Sanguosha.getCardById(content.byCard).GeneralName === 'lebusishu' &&
            room.getFlag(content.toId, this.GeneralName) === true);
    }
    async onTrigger(room, skillUseEvent) {
        skillUseEvent.translationsMessage = translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} sishu effect, lebusishu result will reverse', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(skillUseEvent.fromId))).extract();
        return true;
    }
    async onEffect(room, skillEffectEvent) {
        const judgeEvent = skillEffectEvent.triggeredOnEvent;
        judgeEvent.judgeMatcherEnum = 8 /* SiShu */;
        return true;
    }
};
SiShuShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.CommonSkill({ name: SiShu.GeneralName, description: SiShu.Description })
], SiShuShadow);
exports.SiShuShadow = SiShuShadow;
