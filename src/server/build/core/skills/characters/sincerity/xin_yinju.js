"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XinYinJuDebuff = exports.XinYinJu = void 0;
const tslib_1 = require("tslib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let XinYinJu = class XinYinJu extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return !owner.hasUsedSkill(this.Name);
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, target) {
        return target !== owner;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 0;
    }
    isAvailableCard(owner, room, cardId) {
        return false;
    }
    async onUse() {
        return true;
    }
    async onEffect(room, event) {
        if (!event.toIds) {
            return false;
        }
        const toId = event.toIds[0];
        const response = await room.askForCardUse({
            toId,
            cardUserId: toId,
            scopedTargets: [event.fromId],
            cardMatcher: new card_matcher_1.CardMatcher({ generalName: ['slash'] }).toSocketPassenger(),
            extraUse: true,
            conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please use a slash to {1} , or you will skip your next play card phase and drop card phase', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(event.fromId))).extract(),
            triggeredBySkills: [this.Name],
        }, toId);
        if (response.cardId !== undefined) {
            const slashUseEvent = {
                fromId: response.fromId,
                targetGroup: response.toIds && [response.toIds],
                cardId: response.cardId,
                triggeredBySkills: [this.Name],
            };
            await room.useCard(slashUseEvent, true);
        }
        else {
            room.setFlag(toId, this.Name, true, this.Name);
            room.getPlayerById(toId).hasShadowSkill(XinYinJuDebuff.Name) ||
                (await room.obtainSkill(toId, XinYinJuDebuff.Name));
        }
        return true;
    }
};
XinYinJu = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'xin_yinju', description: 'xin_yinju_description' })
], XinYinJu);
exports.XinYinJu = XinYinJu;
let XinYinJuDebuff = class XinYinJuDebuff extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return (room.CurrentPlayer === room.getPlayerById(owner) &&
            room.CurrentPlayerPhase === 7 /* PhaseFinish */ &&
            stage === "PhaseChanged" /* PhaseChanged */);
    }
    isAutoTrigger() {
        return true;
    }
    isFlaggedSkill(room, event, stage) {
        return stage === "PhaseChanged" /* PhaseChanged */;
    }
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */ || stage === "PhaseChanged" /* PhaseChanged */;
    }
    canUse(room, owner, event, stage) {
        const identifier = event_packer_1.EventPacker.getIdentifier(event);
        if (identifier === 105 /* PhaseStageChangeEvent */) {
            const phaseStageChangeEvent = event;
            return (phaseStageChangeEvent.playerId === owner.Id &&
                phaseStageChangeEvent.toStage === 3 /* PrepareStageStart */ &&
                owner.getFlag(XinYinJu.Name) !== undefined);
        }
        else if (identifier === 104 /* PhaseChangeEvent */) {
            const phaseChangeEvent = event;
            return phaseChangeEvent.fromPlayer === owner.Id && phaseChangeEvent.from === 7 /* PhaseFinish */;
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const unknownEvent = event.triggeredOnEvent;
        const identifier = event_packer_1.EventPacker.getIdentifier(unknownEvent);
        if (identifier === 105 /* PhaseStageChangeEvent */) {
            await room.skip(event.fromId, 4 /* PlayCardStage */);
            await room.skip(event.fromId, 5 /* DropCardStage */);
        }
        room.removeFlag(event.fromId, XinYinJu.Name);
        await room.loseSkill(event.fromId, this.Name);
        return true;
    }
};
XinYinJuDebuff = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: 's_xin_yinju_debuff', description: 's_xin_yinju_debuff_description' })
], XinYinJuDebuff);
exports.XinYinJuDebuff = XinYinJuDebuff;
