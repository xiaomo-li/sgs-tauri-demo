"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuoYu = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let RuoYu = class RuoYu extends skill_1.TriggerSkill {
    get RelatedSkills() {
        return ['jijiang', 'sishu'];
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
    async onEffect(room, skillEffectEvent) {
        const fromId = skillEffectEvent.fromId;
        await room.changeMaxHp(fromId, 1);
        await room.recover({
            recoveredHp: 1,
            toId: fromId,
            recoverBy: fromId,
            triggeredBySkills: [this.Name],
        });
        await room.obtainSkill(fromId, 'jijiang', true);
        await room.obtainSkill(fromId, 'sishu', true);
        return true;
    }
};
RuoYu = tslib_1.__decorate([
    skill_wrappers_1.LordSkill,
    skill_wrappers_1.AwakeningSkill({ name: 'ruoyu', description: 'ruoyu_description' })
], RuoYu);
exports.RuoYu = RuoYu;
