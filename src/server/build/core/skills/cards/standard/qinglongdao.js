"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QingLongYanYueDaoSkill = void 0;
const tslib_1 = require("tslib");
const qinglongdao_1 = require("core/ai/skills/cards/qinglongdao");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let QingLongYanYueDaoSkill = class QingLongYanYueDaoSkill extends skill_1.TriggerSkill {
    isAutoTrigger() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "CardEffectCancelledOut" /* CardEffectCancelledOut */;
    }
    canUse(room, owner, content) {
        return content.fromId === owner.Id && engine_1.Sanguosha.getCardById(content.cardId).GeneralName === 'slash';
    }
    async onTrigger(room, content) {
        content.translationsMessage = undefined;
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const slashEffectEvent = skillUseEvent.triggeredOnEvent;
        const from = room.getPlayerById(skillUseEvent.fromId);
        const askForSlash = {
            toId: slashEffectEvent.fromId,
            scopedTargets: slashEffectEvent.toIds,
            extraUse: true,
            cardMatcher: new card_matcher_1.CardMatcher({ generalName: ['slash'] }).toSocketPassenger(),
            conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('do you want to trigger skill {0} ?', this.Name).extract(),
            triggeredBySkills: [this.Name],
        };
        const response = await room.askForCardUse(askForSlash, slashEffectEvent.fromId);
        if (response.cardId !== undefined) {
            const slashEvent = {
                fromId: response.fromId,
                cardId: response.cardId,
                targetGroup: slashEffectEvent.toIds && [slashEffectEvent.toIds],
                extraUse: true,
                translationsMessage: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} used skill {1}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(from), this.Name).extract(),
                triggeredBySkills: [engine_1.Sanguosha.getCardById(slashEffectEvent.cardId).Name],
            };
            await room.useCard(slashEvent, true);
        }
        return response.cardId !== undefined;
    }
};
QingLongYanYueDaoSkill = tslib_1.__decorate([
    skill_1.AI(qinglongdao_1.QingLongDaoSkillTrigger),
    skill_1.CommonSkill({ name: 'qinglongyanyuedao', description: 'qinglongyanyuedao_description' })
], QingLongYanYueDaoSkill);
exports.QingLongYanYueDaoSkill = QingLongYanYueDaoSkill;
