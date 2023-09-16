"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JuYi = void 0;
const tslib_1 = require("tslib");
const skills_1 = require("core/skills");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let JuYi = class JuYi extends skill_1.TriggerSkill {
    get RelatedSkills() {
        return ['benghuai', 'weizhong'];
    }
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */ && event.toStage === 3 /* PrepareStageStart */;
    }
    canUse(room, owner, content) {
        return content.playerId === owner.Id && room.enableToAwaken(this.Name, owner);
    }
    async onTrigger(room, skillUseEvent) {
        skillUseEvent.translationsMessage = translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} activated awakening skill {1}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(skillUseEvent.fromId)), this.Name).extract();
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        await room.drawCards(room.getPlayerById(fromId).MaxHp, fromId, 'top', fromId, this.Name);
        await room.obtainSkill(fromId, skills_1.BengHuai.Name);
        await room.obtainSkill(fromId, skills_1.WeiZhong.Name);
        return true;
    }
};
JuYi = tslib_1.__decorate([
    skill_wrappers_1.AwakeningSkill({ name: 'juyi', description: 'juyi_description' })
], JuYi);
exports.JuYi = JuYi;
