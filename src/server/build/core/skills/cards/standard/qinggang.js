"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QingGangSkill = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let QingGangSkill = class QingGangSkill extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return (stage === "AfterAim" /* AfterAim */ &&
            event.byCardId !== undefined &&
            engine_1.Sanguosha.getCardById(event.byCardId).GeneralName === 'slash');
    }
    canUse(room, owner, content) {
        return !!content && owner.Id === content.fromId;
    }
    async onTrigger(room, content) {
        content.translationsMessage = translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} triggered skill {1}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(content.fromId)), this.Name).extract();
        return true;
    }
    isRefreshAt() {
        return false;
    }
    async onEffect(room, skillUseEvent) {
        const { triggeredOnEvent } = skillUseEvent;
        const aimEvent = triggeredOnEvent;
        aimEvent.triggeredBySkills = aimEvent.triggeredBySkills ? [...aimEvent.triggeredBySkills, this.Name] : [this.Name];
        return true;
    }
};
QingGangSkill = tslib_1.__decorate([
    skill_1.UniqueSkill,
    skill_1.CompulsorySkill({ name: 'qinggang', description: 'qinggang_description' })
], QingGangSkill);
exports.QingGangSkill = QingGangSkill;
