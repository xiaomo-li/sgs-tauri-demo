"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FangQuanShadow = exports.FangQuan = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let FangQuan = class FangQuan extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return event.to === 4 /* PlayCardStage */ && stage === "BeforePhaseChange" /* BeforePhaseChange */;
    }
    canUse(room, owner, content) {
        return content.toPlayer === owner.Id;
    }
    isRefreshAt(room, owner, stage) {
        return stage === 0 /* PhaseBegin */;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const { fromId } = skillUseEvent;
        await room.skip(fromId, 4 /* PlayCardStage */);
        return true;
    }
};
FangQuan = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'fangquan', description: 'fangquan_description' })
], FangQuan);
exports.FangQuan = FangQuan;
let FangQuanShadow = class FangQuanShadow extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        return (content.playerId === owner.Id &&
            content.toStage === 16 /* DropCardStageStart */ &&
            owner.hasUsedSkill(this.GeneralName));
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(ownerId, room, targetId) {
        return targetId !== ownerId;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    isAvailableCard(owner, room, cardId) {
        return room.canDropCard(owner, cardId);
    }
    availableCardAreas() {
        return [0 /* HandArea */];
    }
    getSkillLog(room, owner) {
        return 'fangquan: choose 1 card and 1 player to whom you ask play one round';
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const { fromId, cardIds, toIds } = skillUseEvent;
        await room.dropCards(4 /* SelfDrop */, cardIds, fromId, fromId, this.GeneralName);
        room.insertPlayerRound(toIds[0]);
        return true;
    }
};
FangQuanShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.CommonSkill({ name: FangQuan.GeneralName, description: FangQuan.Description })
], FangQuanShadow);
exports.FangQuanShadow = FangQuanShadow;
