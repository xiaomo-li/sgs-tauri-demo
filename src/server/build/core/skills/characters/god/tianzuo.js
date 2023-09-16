"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TianZuoShadow = exports.TianZuo = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let TianZuo = class TianZuo extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterGameBegan" /* AfterGameBegan */;
    }
    isAutoTrigger() {
        return true;
    }
    canUse() {
        return true;
    }
    async onTrigger(room, skillUseEvent) {
        skillUseEvent.messages = skillUseEvent.messages || [];
        skillUseEvent.messages.push(translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} shuffled 8 {1} cards into the draw stack', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(skillUseEvent.fromId)), 'qizhengxiangsheng').toString());
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const cardIds = engine_1.Sanguosha.getSkillGeneratedCards(this.Name).map(card => card.Id);
        room.shuffleCardsIntoDrawStack(cardIds);
        return true;
    }
};
TianZuo = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'tianzuo', description: 'tianzuo_description' })
], TianZuo);
exports.TianZuo = TianZuo;
let TianZuoShadow = class TianZuoShadow extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "PreCardEffect" /* PreCardEffect */;
    }
    canUse(room, owner, content) {
        return (content.toIds !== undefined &&
            content.toIds.includes(owner.Id) &&
            engine_1.Sanguosha.getCardById(content.cardId).GeneralName === 'qizhengxiangsheng');
    }
    async onTrigger(room, content) {
        const cardEffectEvent = content.triggeredOnEvent;
        content.translationsMessage = translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} triggered skill {1}, nullify {2}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(content.fromId)), this.Name, translation_json_tool_1.TranslationPack.patchCardInTranslation(cardEffectEvent.cardId)).extract();
        return true;
    }
    async onEffect(room, event) {
        const cardEffectEvent = event.triggeredOnEvent;
        cardEffectEvent.nullifiedTargets = cardEffectEvent.nullifiedTargets || [];
        cardEffectEvent.nullifiedTargets.push(event.fromId);
        return true;
    }
};
TianZuoShadow = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_wrappers_1.CompulsorySkill({ name: TianZuo.Name, description: TianZuo.Description })
], TianZuoShadow);
exports.TianZuoShadow = TianZuoShadow;
