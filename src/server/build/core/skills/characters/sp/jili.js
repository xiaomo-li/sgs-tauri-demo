"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JiLiRemove = exports.JiLiShadow = exports.JiLi = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let JiLi = class JiLi extends skill_1.TriggerSkill {
    async whenObtainingSkill(room, owner) {
        const cardUsedNum = room.Analytics.getRecordEvents(event => (event_packer_1.EventPacker.getIdentifier(event) === 124 /* CardUseEvent */ ||
            event_packer_1.EventPacker.getIdentifier(event) === 123 /* CardResponseEvent */) &&
            event.fromId === owner.Id, owner.Id, 'round').length;
        owner.setFlag(this.Name, cardUsedNum);
    }
    async whenLosingSkill(room, owner) {
        if (owner.getFlag(this.Name) !== undefined) {
            owner.removeFlag(this.Name);
        }
    }
    isTriggerable(event, stage) {
        return stage === "CardUsing" /* CardUsing */ || stage === "CardResponsing" /* CardResponsing */;
    }
    canUse(room, owner, content) {
        return content.fromId === owner.Id && (owner.getFlag(this.Name) || 0) === owner.getAttackRange(room);
    }
    getSkillLog(room, owner) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to draw {1} card(s)?', this.Name, owner.getFlag(this.Name)).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        await room.drawCards(room.getPlayerById(event.fromId).getAttackRange(room), event.fromId, 'top', event.fromId, this.Name);
        return true;
    }
};
JiLi = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'jili', description: 'jili_description' })
], JiLi);
exports.JiLi = JiLi;
let JiLiShadow = class JiLiShadow extends skill_1.TriggerSkill {
    isAutoTrigger() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "BeforeCardUseEffect" /* BeforeCardUseEffect */ || stage === "PreCardResponse" /* PreCardResponse */;
    }
    canUse(room, owner, content) {
        return owner.Id === content.fromId;
    }
    isFlaggedSkill() {
        return true;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const from = room.getPlayerById(event.fromId);
        const cardUsedNum = room.getFlag(event.fromId, this.GeneralName) || 0;
        from.setFlag(this.GeneralName, cardUsedNum + 1);
        return true;
    }
};
JiLiShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: JiLi.Name, description: JiLi.Description })
], JiLiShadow);
exports.JiLiShadow = JiLiShadow;
let JiLiRemove = class JiLiRemove extends skill_1.TriggerSkill {
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
        return event.from === 7 /* PhaseFinish */ && owner.getFlag(this.GeneralName) !== undefined;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        room.removeFlag(event.fromId, this.GeneralName);
        return true;
    }
};
JiLiRemove = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: JiLiShadow.Name, description: JiLiShadow.Description })
], JiLiRemove);
exports.JiLiRemove = JiLiRemove;
