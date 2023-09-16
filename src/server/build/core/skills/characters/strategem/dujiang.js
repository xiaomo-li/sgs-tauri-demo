"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DuJiang = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
const duojing_1 = require("./duojing");
let DuJiang = class DuJiang extends skill_1.TriggerSkill {
    get RelatedSkills() {
        return [duojing_1.DuoJing.Name];
    }
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        return (content.playerId === owner.Id &&
            content.toStage === 3 /* PrepareStageStart */ &&
            room.enableToAwaken(this.Name, owner));
    }
    async onTrigger(room, skillUseEvent) {
        skillUseEvent.translationsMessage = translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} activated awakening skill {1}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(skillUseEvent.fromId)), this.Name).extract();
        return true;
    }
    async onEffect(room, event) {
        await room.obtainSkill(event.fromId, this.RelatedSkills[0]);
        return true;
    }
};
DuJiang = tslib_1.__decorate([
    skill_wrappers_1.AwakeningSkill({ name: 'dujiang', description: 'dujiang_description' })
], DuJiang);
exports.DuJiang = DuJiang;
