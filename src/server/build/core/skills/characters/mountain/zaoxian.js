"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZaoXian = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let ZaoXian = class ZaoXian extends skill_1.TriggerSkill {
    get RelatedSkills() {
        return ['jixi'];
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
        await room.changeMaxHp(event.fromId, -1);
        await room.obtainSkill(event.fromId, 'jixi', true);
        return true;
    }
};
ZaoXian = tslib_1.__decorate([
    skill_1.AwakeningSkill({ name: 'zaoxian', description: 'zaoxian_description' })
], ZaoXian);
exports.ZaoXian = ZaoXian;
