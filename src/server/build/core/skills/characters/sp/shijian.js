"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShiJianRemover = exports.ShiJianRecorder = exports.ShiJian = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
const yuxu_1 = require("./yuxu");
let ShiJian = class ShiJian extends skill_1.TriggerSkill {
    async whenObtainingSkill(room, owner) {
        room.CurrentPlayerPhase === 4 /* PlayCardStage */ &&
            room.CurrentPhasePlayer !== undefined &&
            room.CurrentPhasePlayer !== owner &&
            owner.setFlag(this.Name, room.Analytics.getCardUseRecord(room.CurrentPlayer.Id, 'phase').length);
    }
    isTriggerable(event, stage) {
        return stage === "CardUseFinishedEffect" /* CardUseFinishedEffect */;
    }
    canUse(room, owner, content) {
        return (content.fromId !== owner.Id &&
            room.CurrentPlayerPhase === 4 /* PlayCardStage */ &&
            room.CurrentPhasePlayer === room.getPlayerById(content.fromId) &&
            event_packer_1.EventPacker.getMiddleware(this.Name, content) === true &&
            owner.getPlayerCards().length > 0 &&
            !room.getPlayerById(content.fromId).Dead);
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    isAvailableCard(owner, room, cardId) {
        return room.canDropCard(owner, cardId);
    }
    getSkillLog(room, owner, event) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to discard a card to let {1} obtain ‘Yu Xu’?', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(event.fromId))).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        if (!event.cardIds) {
            return false;
        }
        await room.dropCards(4 /* SelfDrop */, event.cardIds, event.fromId, event.fromId, this.Name);
        const user = event.triggeredOnEvent.fromId;
        if (!room.getPlayerById(user).hasSkill(yuxu_1.YuXu.Name)) {
            await room.obtainSkill(user, yuxu_1.YuXu.Name);
            await room.obtainSkill(user, ShiJianRemover.Name);
        }
        return true;
    }
};
ShiJian = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'shijian', description: 'shijian_description' })
], ShiJian);
exports.ShiJian = ShiJian;
let ShiJianRecorder = class ShiJianRecorder extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 4 /* PlayCardStage */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    async whenDead(room, owner) {
        owner.removeFlag(this.GeneralName);
    }
    isAutoTrigger() {
        return true;
    }
    isFlaggedSkill() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "BeforeCardUseEffect" /* BeforeCardUseEffect */ || stage === "PhaseChanged" /* PhaseChanged */;
    }
    canUse(room, owner, content) {
        const identifier = event_packer_1.EventPacker.getIdentifier(content);
        if (identifier === 124 /* CardUseEvent */) {
            const cardUseEvent = content;
            return (cardUseEvent.fromId !== owner.Id &&
                room.CurrentPlayerPhase === 4 /* PlayCardStage */ &&
                room.CurrentPhasePlayer === room.getPlayerById(cardUseEvent.fromId));
        }
        else if (identifier === 104 /* PhaseChangeEvent */) {
            return (content.from === 4 /* PlayCardStage */ &&
                owner.getFlag(this.GeneralName) !== undefined);
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const unknownEvent = event.triggeredOnEvent;
        const identifier = event_packer_1.EventPacker.getIdentifier(unknownEvent);
        if (identifier === 124 /* CardUseEvent */) {
            let originTimes = room.getFlag(event.fromId, this.GeneralName) || 0;
            originTimes++;
            room.getPlayerById(event.fromId).setFlag(this.GeneralName, originTimes);
            originTimes === 2 && event_packer_1.EventPacker.addMiddleware({ tag: this.GeneralName, data: true }, unknownEvent);
        }
        else {
            room.removeFlag(event.fromId, this.GeneralName);
        }
        return true;
    }
};
ShiJianRecorder = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: ShiJian.Name, description: ShiJian.Description })
], ShiJianRecorder);
exports.ShiJianRecorder = ShiJianRecorder;
let ShiJianRemover = class ShiJianRemover extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    async whenDead(room, owner) {
        owner.hasSkill(yuxu_1.YuXu.Name) && (await room.loseSkill(owner.Id, yuxu_1.YuXu.Name));
        await room.loseSkill(owner.Id, this.Name);
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
    canUse(room, owner, content) {
        return content.from === 7 /* PhaseFinish */;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        room.getPlayerById(event.fromId).hasSkill(yuxu_1.YuXu.Name) && (await room.loseSkill(event.fromId, yuxu_1.YuXu.Name));
        await room.loseSkill(event.fromId, this.Name);
        return true;
    }
};
ShiJianRemover = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: 's_shijian_remover', description: 's_shijian_remover_description' })
], ShiJianRemover);
exports.ShiJianRemover = ShiJianRemover;
