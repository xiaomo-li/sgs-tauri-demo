"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JiSheShadow = exports.JiShe = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let JiShe = class JiShe extends skill_1.ActiveSkill {
    isRefreshAt(room, owner, stage) {
        return stage === 0 /* PhaseBegin */;
    }
    async whenRefresh(room, owner) {
        room.syncGameCommonRules(owner.Id, user => {
            const decreasedHold = user.getInvisibleMark(this.Name);
            user.removeInvisibleMark(this.Name);
            room.CommonRules.addAdditionalHoldCardNumber(user, decreasedHold);
        });
    }
    canUse(room, owner) {
        return owner.getMaxCardHold(room) > 0;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 0;
    }
    numberOfTargets() {
        return 0;
    }
    isAvailableTarget(owner, room, target) {
        return false;
    }
    isAvailableCard() {
        return false;
    }
    async onUse(room, event) {
        return true;
    }
    async onEffect(room, event) {
        await room.drawCards(1, event.fromId, 'top', event.fromId, this.Name);
        room.syncGameCommonRules(event.fromId, user => {
            user.addInvisibleMark(this.Name, 1);
            room.CommonRules.addAdditionalHoldCardNumber(user, -1);
        });
        return true;
    }
};
JiShe = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'jishe', description: 'jishe_description' })
], JiShe);
exports.JiShe = JiShe;
let JiSheShadow = class JiSheShadow extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, event) {
        return (event.playerId === owner.Id &&
            event.toStage === 19 /* FinishStageStart */ &&
            owner.Hp > 0 &&
            owner.getCardIds(0 /* HandArea */).length === 0);
    }
    targetFilter(room, owner, targets) {
        return targets.length > 0 && targets.length <= owner.Hp;
    }
    isAvailableTarget(owner, room, target) {
        return !room.getPlayerById(target).ChainLocked;
    }
    getSkillLog(room, owner) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to choose at most {1} targets to chain on?', this.Name, owner.Hp).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        if (!event.toIds) {
            return false;
        }
        for (const toId of event.toIds) {
            await room.chainedOn(toId);
        }
        return true;
    }
};
JiSheShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.CommonSkill({ name: JiShe.Name, description: JiShe.Description })
], JiSheShadow);
exports.JiSheShadow = JiSheShadow;
