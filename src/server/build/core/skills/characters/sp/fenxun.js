"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FenXunDiscard = exports.FenXunShadow = exports.FenXun = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let FenXun = class FenXun extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return !owner.hasUsedSkill(this.Name);
    }
    cardFilter(room, owner, cards) {
        return cards.length === 0;
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, target) {
        return target !== owner;
    }
    isAvailableCard() {
        return false;
    }
    async onUse(room, event) {
        return true;
    }
    async onEffect(room, event) {
        if (!event.toIds) {
            return false;
        }
        const originalTargets = room.getFlag(event.fromId, this.Name) || [];
        if (!originalTargets.includes(event.toIds[0])) {
            originalTargets.push(event.toIds[0]);
            room.setFlag(event.fromId, this.Name, originalTargets);
        }
        return true;
    }
};
FenXun = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'fenxun', description: 'fenxun_description' })
], FenXun);
exports.FenXun = FenXun;
let FenXunShadow = class FenXunShadow extends skill_1.RulesBreakerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    breakDistanceTo(room, owner, target) {
        const targets = owner.getFlag(this.GeneralName);
        return targets && targets.includes(target.Id) ? 1 : 0;
    }
};
FenXunShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: FenXun.Name, description: FenXun.Description })
], FenXunShadow);
exports.FenXunShadow = FenXunShadow;
let FenXunDiscard = class FenXunDiscard extends skill_1.TriggerSkill {
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
        return event.from === 7 /* PhaseFinish */ && !!owner.getFlag(this.GeneralName);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const damageRecords = room.Analytics.getDamageRecord(event.fromId, 'round');
        let dropNum = 0;
        for (const toId of room.getFlag(event.fromId, this.GeneralName)) {
            damageRecords.find(event => event.toId === toId) && dropNum++;
        }
        if (dropNum > 0 && room.getPlayerById(event.fromId).getPlayerCards().length > 0) {
            const response = await room.askForCardDrop(event.fromId, dropNum, [0 /* HandArea */, 1 /* EquipArea */], true, undefined, this.GeneralName);
            response.droppedCards.length > 0 &&
                (await room.dropCards(4 /* SelfDrop */, response.droppedCards, event.fromId, event.fromId, this.GeneralName));
        }
        room.removeFlag(event.fromId, this.GeneralName);
        return true;
    }
};
FenXunDiscard = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: FenXunShadow.Name, description: FenXunShadow.Description })
], FenXunDiscard);
exports.FenXunDiscard = FenXunDiscard;
