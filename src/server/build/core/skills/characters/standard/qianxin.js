"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QianXin = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let QianXin = class QianXin extends skill_1.TriggerSkill {
    get RelatedSkills() {
        return ['jianyan'];
    }
    isTriggerable(event, stage) {
        return stage === "AfterDamageEffect" /* AfterDamageEffect */;
    }
    canUse(room, owner, content) {
        return owner.Id === content.fromId && room.enableToAwaken(this.Name, owner);
    }
    async onTrigger(room, skillUseEvent) {
        skillUseEvent.translationsMessage = translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} activated awakening skill {1}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(skillUseEvent.fromId)), this.Name).extract();
        return true;
    }
    async onEffect(room, skillUseEvent) {
        await room.changeMaxHp(skillUseEvent.fromId, -1);
        await room.obtainSkill(skillUseEvent.fromId, 'jianyan', true);
        return true;
    }
};
QianXin = tslib_1.__decorate([
    skill_wrappers_1.AwakeningSkill({ name: 'qianxin', description: 'qianxin_description' })
], QianXin);
exports.QianXin = QianXin;
