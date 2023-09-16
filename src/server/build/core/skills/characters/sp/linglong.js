"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LingLongLose = exports.LingLongShadow = exports.LingLong = void 0;
const tslib_1 = require("tslib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const engine_1 = require("core/game/engine");
const skills_1 = require("core/skills");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let LingLong = class LingLong extends skills_1.BaGuaZhenSkill {
    get RelatedSkills() {
        return ['qicai'];
    }
    async whenObtainingSkill(room, owner) {
        if (!owner.getEquipment(6 /* Precious */) && !owner.hasSkill(skills_1.QiCai.Name)) {
            owner.addInvisibleMark(this.Name, 1);
            await room.obtainSkill(owner.Id, skills_1.QiCai.Name);
        }
    }
    async whenLosingSkill(room, owner) {
        if (owner.getInvisibleMark(this.Name) > 0) {
            owner.removeInvisibleMark(this.Name);
            await room.loseSkill(owner.Id, skills_1.QiCai.Name);
        }
    }
    async beforeUse(room, event) {
        const askForInvoke = {
            toId: event.fromId,
            invokeSkillNames: [this.Name],
        };
        room.notify(171 /* AskForSkillUseEvent */, askForInvoke, event.fromId);
        const { invoke } = await room.onReceivingAsyncResponseFrom(171 /* AskForSkillUseEvent */, event.fromId);
        return invoke !== undefined;
    }
    canUse(room, owner, content) {
        return (super.canUse(room, owner, content) &&
            owner.getEquipment(3 /* Shield */) === undefined &&
            owner.canEquipTo("shield section" /* Shield */));
    }
};
LingLong = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'linglong', description: 'linglong_description' })
], LingLong);
exports.LingLong = LingLong;
let LingLongShadow = class LingLongShadow extends skill_1.RulesBreakerSkill {
    breakCardUsableTimes(cardId, room, owner) {
        if (owner.getEquipment(2 /* Weapon */)) {
            return 0;
        }
        let match = false;
        if (cardId instanceof card_matcher_1.CardMatcher) {
            match = cardId.match(new card_matcher_1.CardMatcher({ generalName: ['slash'] }));
        }
        else {
            match = engine_1.Sanguosha.getCardById(cardId).GeneralName === 'slash';
        }
        if (match) {
            return 1;
        }
        else {
            return 0;
        }
    }
    breakAdditionalCardHoldNumber(room, owner) {
        return owner.getEquipment(5 /* DefenseRide */) || owner.getEquipment(4 /* OffenseRide */) ? 0 : 1;
    }
};
LingLongShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.CompulsorySkill({ name: LingLong.Name, description: LingLong.Description })
], LingLongShadow);
exports.LingLongShadow = LingLongShadow;
let LingLongLose = class LingLongLose extends skill_1.TriggerSkill {
    getPriority() {
        return 0 /* High */;
    }
    isTriggerable(event, stage) {
        return stage === "AfterCardMoved" /* AfterCardMoved */;
    }
    canUse(room, owner, content) {
        return ((!owner.getEquipment(6 /* Precious */) && !owner.hasSkill(skills_1.QiCai.Name)) ||
            (owner.getEquipment(6 /* Precious */) !== undefined && owner.getInvisibleMark(this.GeneralName) > 0));
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const from = room.getPlayerById(event.fromId);
        if (!from.getEquipment(6 /* Precious */) && !from.hasSkill(skills_1.QiCai.Name)) {
            await room.obtainSkill(event.fromId, skills_1.QiCai.Name);
            from.addInvisibleMark(this.GeneralName, 1);
        }
        else if (from.getEquipment(6 /* Precious */) && from.getInvisibleMark(this.GeneralName) > 0) {
            from.removeInvisibleMark(this.GeneralName);
            await room.loseSkill(event.fromId, skills_1.QiCai.Name);
        }
        return true;
    }
};
LingLongLose = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.CompulsorySkill({ name: LingLongShadow.Name, description: LingLongShadow.Description })
], LingLongLose);
exports.LingLongLose = LingLongLose;
