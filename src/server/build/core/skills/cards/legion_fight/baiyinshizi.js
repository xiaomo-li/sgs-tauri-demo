"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaiYinShiZiSkill = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let BaiYinShiZiSkill = class BaiYinShiZiSkill extends skill_1.TriggerSkill {
    async whenLosingSkill(room, owner) {
        if (!owner.Dead && owner.isInjured()) {
            await room.recover({
                recoveredHp: 1,
                toId: owner.Id,
                triggeredBySkills: [this.Name],
            });
        }
    }
    isTriggerable(event, stage) {
        return stage === "DamagedEffect" /* DamagedEffect */;
    }
    canUse(room, owner, content) {
        const damageEvent = content;
        return damageEvent.toId === owner.Id && damageEvent.damage > 1;
    }
    async onTrigger(room, content) {
        content.translationsMessage = translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} triggered skill {1}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(content.fromId)), this.Name).extract();
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const { fromId } = skillUseEvent;
        const damageEvent = skillUseEvent.triggeredOnEvent;
        damageEvent.damage = 1;
        damageEvent.messages = damageEvent.messages || [];
        damageEvent.messages.push(translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} triggered skill {1}, damage reduces to {2}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(fromId)), this.Name, damageEvent.damage).toString());
        return true;
    }
};
BaiYinShiZiSkill = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'baiyinshizi', description: 'baiyinshizi_description' })
], BaiYinShiZiSkill);
exports.BaiYinShiZiSkill = BaiYinShiZiSkill;
