"use strict";
var FuBiShadow_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FuBiClear = exports.FuBiShadow = exports.FuBi = void 0;
const tslib_1 = require("tslib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let FuBi = class FuBi extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterGameStarted" /* AfterGameStarted */;
    }
    canUse() {
        return true;
    }
    async onTrigger() {
        return true;
    }
    targetFilter(room, owner, targets) {
        return targets.length === 1;
    }
    isAvailableTarget(owner, room, target) {
        return target !== owner;
    }
    async onEffect(room, event) {
        const { toIds } = event;
        if (!toIds) {
            return false;
        }
        room.addMark(toIds[0], "fu" /* Fu */, 1);
        return true;
    }
};
FuBi = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'fubi', description: 'fubi_description' })
], FuBi);
exports.FuBi = FuBi;
let FuBiShadow = FuBiShadow_1 = class FuBiShadow extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */ && event.toStage === 4 /* PrepareStage */;
    }
    canUse(room, owner, content, stage) {
        return room.getPlayerById(content.playerId).getMark("fu" /* Fu */) > 0;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, triggeredOnEvent } = event;
        const { playerId } = triggeredOnEvent;
        const askForOption = {
            options: ['option-one', 'option-two'],
            toId: fromId,
            conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: 1.owner has extra 3 cards hold limit, 2.one more time to use slash in current round', this.Name).extract(),
            triggeredBySkills: [this.Name],
        };
        room.notify(168 /* AskForChoosingOptionsEvent */, event_packer_1.EventPacker.createUncancellableEvent(askForOption), fromId);
        const { selectedOption } = await room.onReceivingAsyncResponseFrom(168 /* AskForChoosingOptionsEvent */, fromId);
        if (!selectedOption) {
            throw new Error(`Unable to get selected option of ${this.Name}`);
        }
        if (selectedOption === askForOption.options[0]) {
            room.syncGameCommonRules(playerId, user => {
                user.addInvisibleMark(FuBiShadow_1.CardHoldExtender, 3);
                room.CommonRules.addAdditionalHoldCardNumber(user, 3);
            });
        }
        else if (selectedOption === askForOption.options[1]) {
            room.syncGameCommonRules(playerId, user => {
                user.addInvisibleMark(FuBiShadow_1.SlashExtender, 1);
                room.CommonRules.addCardUsableTimes(new card_matcher_1.CardMatcher({ generalName: ['slash'] }), 1, user);
            });
        }
        return true;
    }
};
FuBiShadow.CardHoldExtender = 'fubi-holder';
FuBiShadow.SlashExtender = 'fubi-slash';
FuBiShadow = FuBiShadow_1 = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.CommonSkill({ name: FuBi.Name, description: FuBi.Description })
], FuBiShadow);
exports.FuBiShadow = FuBiShadow;
let FuBiClear = class FuBiClear extends skill_1.TriggerSkill {
    get Muted() {
        return true;
    }
    isFlaggedSkill() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "AfterStageChanged" /* AfterStageChanged */;
    }
    isAutoTrigger() {
        return true;
    }
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    canUse(room, owner, content) {
        const event = content;
        const player = room.getPlayerById(content.playerId);
        return (event.toStage === 23 /* PhaseFinish */ &&
            (player.getInvisibleMark(FuBiShadow.SlashExtender) > 0 ||
                player.getInvisibleMark(FuBiShadow.CardHoldExtender) > 0));
    }
    async onTrigger(room, event) {
        event.translationsMessage = undefined;
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const { triggeredOnEvent } = skillUseEvent;
        const { playerId } = triggeredOnEvent;
        const from = room.getPlayerById(playerId);
        if (from.getInvisibleMark(FuBiShadow.CardHoldExtender)) {
            room.syncGameCommonRules(playerId, user => {
                user.removeInvisibleMark(FuBiShadow.CardHoldExtender);
                room.CommonRules.addAdditionalHoldCardNumber(user, -3);
            });
        }
        if (from.getInvisibleMark(FuBiShadow.SlashExtender)) {
            room.syncGameCommonRules(playerId, user => {
                user.removeInvisibleMark(FuBiShadow.SlashExtender);
                room.CommonRules.addCardUsableTimes(new card_matcher_1.CardMatcher({ generalName: ['slash'] }), -1, user);
            });
        }
        return true;
    }
};
FuBiClear = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: FuBiShadow.Name, description: FuBiShadow.Description })
], FuBiClear);
exports.FuBiClear = FuBiClear;
