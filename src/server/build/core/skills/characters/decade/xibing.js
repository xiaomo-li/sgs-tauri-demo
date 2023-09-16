"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XiBingRemover = exports.XiBingBlocker = exports.XiBing = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const aim_group_1 = require("core/shares/libs/utils/aim_group");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let XiBing = class XiBing extends skill_1.TriggerSkill {
    isRefreshAt(room, owner, stage) {
        return stage === 0 /* PhaseBegin */;
    }
    isTriggerable(event, stage) {
        return stage === "AfterAim" /* AfterAim */;
    }
    canUse(room, owner, content) {
        const card = engine_1.Sanguosha.getCardById(content.byCardId);
        return (content.fromId !== owner.Id &&
            room.CurrentPhasePlayer === room.getPlayerById(content.fromId) &&
            room.CurrentPlayerPhase === 4 /* PlayCardStage */ &&
            !room.getPlayerById(content.fromId).Dead &&
            card.isBlack() &&
            (card.GeneralName === 'slash' || card.isCommonTrick()) &&
            aim_group_1.AimGroupUtil.getAllTargets(content.allTargets).length === 1);
    }
    getSkillLog(room, owner, event) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to use this skill to {1} ?', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(event.fromId))).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const toId = event.triggeredOnEvent.fromId;
        const diff = Math.min(room.getPlayerById(toId).Hp, 5) - room.getPlayerById(toId).getCardIds(0 /* HandArea */).length;
        if (diff > 0) {
            await room.drawCards(diff, toId, 'top', event.fromId, this.Name);
            for (const skillName of [XiBingBlocker.Name, XiBingRemover.Name]) {
                room.getPlayerById(toId).hasShadowSkill(skillName) || (await room.obtainSkill(toId, skillName));
            }
        }
        return true;
    }
};
XiBing = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'xibing', description: 'xibing_description' })
], XiBing);
exports.XiBing = XiBing;
let XiBingBlocker = class XiBingBlocker extends skill_1.FilterSkill {
    canUseCard(cardId, room, owner, onResponse, isCardResponse) {
        return isCardResponse === true;
    }
};
XiBingBlocker = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: 's_xibing_blocker', description: 's_xibing_blocker_description' })
], XiBingBlocker);
exports.XiBingBlocker = XiBingBlocker;
let XiBingRemover = class XiBingRemover extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    isAutoTrigger() {
        return true;
    }
    isFlaggedSkill() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "PhaseChanged" /* PhaseChanged */;
    }
    canUse(room, owner, event) {
        return event.from === 7 /* PhaseFinish */;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        await room.loseSkill(event.fromId, this.Name);
        room.getPlayerById(event.fromId).hasShadowSkill(XiBingBlocker.Name) &&
            (await room.loseSkill(event.fromId, XiBingBlocker.Name));
        return true;
    }
};
XiBingRemover = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: 's_xibing_remover', description: 's_xibing_remover_description' })
], XiBingRemover);
exports.XiBingRemover = XiBingRemover;
