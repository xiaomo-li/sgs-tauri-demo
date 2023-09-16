"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManYi = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let ManYi = class ManYi extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "PreCardEffect" /* PreCardEffect */;
    }
    canUse(room, owner, event) {
        return (event.toIds !== undefined &&
            event.toIds.includes(owner.Id) &&
            engine_1.Sanguosha.getCardById(event.cardId).GeneralName === 'nanmanruqing');
    }
    async onTrigger(room, content) {
        const cardEffectEvent = content.triggeredOnEvent;
        content.translationsMessage = translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} triggered skill {1}, nullify {2}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(content.fromId)), this.Name, translation_json_tool_1.TranslationPack.patchCardInTranslation(cardEffectEvent.cardId)).extract();
        return true;
    }
    async onEffect(room, event) {
        var _a;
        const cardEffectEvent = event.triggeredOnEvent;
        (_a = cardEffectEvent.nullifiedTargets) === null || _a === void 0 ? void 0 : _a.push(event.fromId);
        return true;
    }
};
ManYi = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'manyi', description: 'manyi_description' })
], ManYi);
exports.ManYi = ManYi;
