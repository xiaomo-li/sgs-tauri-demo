"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XingLuan = void 0;
const tslib_1 = require("tslib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let XingLuan = class XingLuan extends skill_1.TriggerSkill {
    isRefreshAt(room, owner, stage) {
        return stage === 4 /* PlayCardStage */;
    }
    isTriggerable(event, stage) {
        return stage === "CardUseFinishedEffect" /* CardUseFinishedEffect */;
    }
    canUse(room, owner, content) {
        return (content.fromId === owner.Id &&
            room.CurrentPhasePlayer === owner &&
            room.CurrentPlayerPhase === 4 /* PlayCardStage */ &&
            !owner.hasUsedSkill(this.Name));
    }
    getSkillLog(room, owner, event) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to gain a card with card number 6 from draw stack?', this.Name).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const sixCards = room.findCardsByMatcherFrom(new card_matcher_1.CardMatcher({ cardNumber: [6] }));
        sixCards.length > 0 &&
            (await room.moveCards({
                movingCards: [
                    { card: sixCards[Math.floor(Math.random() * sixCards.length)], fromArea: 5 /* DrawStack */ },
                ],
                toId: event.fromId,
                toArea: 0 /* HandArea */,
                moveReason: 2 /* ActiveMove */,
                proposer: event.fromId,
                triggeredBySkills: [this.Name],
            }));
        return true;
    }
};
XingLuan = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'xingluan', description: 'xingluan_description' })
], XingLuan);
exports.XingLuan = XingLuan;
