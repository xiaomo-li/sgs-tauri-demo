"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LianPo = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let LianPo = class LianPo extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterStageChanged" /* AfterStageChanged */ && event.toStage === 23 /* PhaseFinish */;
    }
    canUse(room, owner, content) {
        return (room.Analytics.getRecordEvents(event => {
            if (event_packer_1.EventPacker.getIdentifier(event) !== 153 /* PlayerDiedEvent */) {
                return false;
            }
            const diedEvent = event;
            return diedEvent.killedBy === owner.Id;
        }, undefined, 'round', undefined, 1).length > 0);
    }
    async onTrigger(room, event) {
        event.translationsMessage = translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} used skill {1}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(event.fromId)), this.Name).extract();
        return true;
    }
    async onEffect(room, skillUseEvent) {
        room.insertPlayerRound(skillUseEvent.fromId);
        return true;
    }
};
LianPo = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'lianpo', description: 'lianpo_description' })
], LianPo);
exports.LianPo = LianPo;
