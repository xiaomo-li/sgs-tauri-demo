"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YingJian = void 0;
const tslib_1 = require("tslib");
const card_1 = require("core/cards/card");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let YingJian = class YingJian extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        return (content.playerId === owner.Id &&
            content.toStage === 3 /* PrepareStageStart */ &&
            owner.canUseCard(room, new card_matcher_1.CardMatcher({ generalName: ['slash'] }), new card_matcher_1.CardMatcher({ generalName: ['slash'] })));
    }
    targetFilter(room, owner, targets) {
        const availableNumOfTargets = 1;
        const additionalNumberOfTargets = this.additionalNumberOfTargets(room, owner, new card_matcher_1.CardMatcher({ generalName: ['slash'] }));
        if (additionalNumberOfTargets > 0) {
            return (targets.length >= availableNumOfTargets && targets.length <= availableNumOfTargets + additionalNumberOfTargets);
        }
        else {
            return targets.length === availableNumOfTargets;
        }
    }
    isAvailableTarget(owner, room, target) {
        return (owner !== target &&
            room.getPlayerById(owner).canUseCardTo(room, new card_matcher_1.CardMatcher({ generalName: ['slash'] }), target));
    }
    getSkillLog() {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to use a virtual slash?', this.Name).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        if (!event.toIds) {
            return false;
        }
        await room.useCard({
            fromId: event.fromId,
            targetGroup: [event.toIds],
            cardId: card_1.VirtualCard.create({ cardName: 'slash', bySkill: this.Name }).Id,
            extraUse: true,
        });
        return true;
    }
};
YingJian = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'yingjian', description: 'yingjian_description' })
], YingJian);
exports.YingJian = YingJian;
