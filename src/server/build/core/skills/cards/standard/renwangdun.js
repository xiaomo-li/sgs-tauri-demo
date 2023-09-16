"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RenWangDunSkill = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let RenWangDunSkill = class RenWangDunSkill extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "PreCardEffect" /* PreCardEffect */;
    }
    canUse(room, owner, content) {
        return (content.toIds !== undefined &&
            content.toIds.includes(owner.Id) &&
            engine_1.Sanguosha.getCardById(content.cardId).GeneralName === 'slash' &&
            engine_1.Sanguosha.getCardById(content.cardId).isBlack());
    }
    async onTrigger(room, content) {
        content.translationsMessage = translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} triggered skill {1}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(content.fromId)), this.Name).extract();
        return true;
    }
    async onEffect(room, skillUseEvent) {
        var _a;
        const { triggeredOnEvent } = skillUseEvent;
        const event = triggeredOnEvent;
        (_a = event.nullifiedTargets) === null || _a === void 0 ? void 0 : _a.push(skillUseEvent.fromId);
        return true;
    }
};
RenWangDunSkill = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'renwangdun', description: 'renwangdun_description' })
], RenWangDunSkill);
exports.RenWangDunSkill = RenWangDunSkill;
