"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SouYingRemover = exports.SouYingShadow = exports.SouYing = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const algorithm_1 = require("core/shares/libs/algorithm");
const aim_group_1 = require("core/shares/libs/utils/aim_group");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let SouYing = class SouYing extends skill_1.TriggerSkill {
    async whenObtainingSkill(room, player) {
        var _a;
        const records = room.Analytics.getRecordEvents(event => event_packer_1.EventPacker.getIdentifier(event) === 131 /* AimEvent */ &&
            ((event.fromId === player.Id && event.toId !== player.Id) ||
                (event.fromId !== player.Id && event.toId === player.Id)));
        for (const record of records) {
            if (record.fromId !== player.Id && !((_a = player.getFlag(this.Name)) === null || _a === void 0 ? void 0 : _a.includes(record.fromId))) {
                const originalPlayers = player.getFlag(this.Name) || [];
                originalPlayers.push(record.fromId);
                player.setFlag(this.Name, originalPlayers);
                event_packer_1.EventPacker.addMiddleware({ tag: this.Name, data: record.fromId }, record);
            }
            else if (record.fromId === player.Id &&
                !!aim_group_1.AimGroupUtil.getAllTargets(record.allTargets).find(playerId => { var _a; return !((_a = player.getFlag(SouYingShadow.Name)) === null || _a === void 0 ? void 0 : _a.includes(playerId)); })) {
                const originalPlayers = player.getFlag(SouYingShadow.Name) || [];
                originalPlayers.push(...algorithm_1.Algorithm.unique(aim_group_1.AimGroupUtil.getAllTargets(record.allTargets), originalPlayers));
                player.setFlag(SouYingShadow.Name, originalPlayers);
                event_packer_1.EventPacker.addMiddleware({ tag: SouYingShadow.Name, data: originalPlayers }, record);
            }
        }
    }
    async whenLosingSkill(room, player) {
        player.removeFlag(this.Name);
        player.removeFlag(SouYingShadow.Name);
    }
    isRefreshAt(room, owner, stage) {
        return stage === 0 /* PhaseBegin */;
    }
    isTriggerable(event, stage) {
        return stage === "AfterAim" /* AfterAim */;
    }
    canUse(room, owner, event) {
        var _a;
        return (!owner.hasUsedSkill(this.Name) &&
            aim_group_1.AimGroupUtil.getAllTargets(event.allTargets).length === 1 &&
            owner.getCardIds(0 /* HandArea */).length > 0 &&
            ((event.fromId !== owner.Id &&
                event.toId === owner.Id &&
                event_packer_1.EventPacker.getMiddleware(this.Name, event) !== event.fromId) ||
                (event.fromId === owner.Id &&
                    event.toId !== owner.Id &&
                    !((_a = event_packer_1.EventPacker.getMiddleware(SouYingShadow.Name, event)) === null || _a === void 0 ? void 0 : _a.includes(event.toId)))));
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    isAvailableCard(owner, room, cardId) {
        return room.canDropCard(owner, cardId);
    }
    getSkillLog(room, owner, event) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher(event.fromId === owner.Id
            ? '{0}: do you want to discard a card to obtain {1} ?'
            : '{0}: do you want to discard a card to let {1} nullify to you?', this.Name, translation_json_tool_1.TranslationPack.patchCardInTranslation(event.byCardId)).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        var _a;
        if (!event.cardIds) {
            return false;
        }
        await room.dropCards(4 /* SelfDrop */, event.cardIds, event.fromId, event.fromId, this.Name);
        const aimEvent = event.triggeredOnEvent;
        if (aimEvent.fromId === event.fromId) {
            room.isCardOnProcessing(aimEvent.byCardId) &&
                (await room.moveCards({
                    movingCards: [{ card: aimEvent.byCardId, fromArea: 6 /* ProcessingArea */ }],
                    toId: event.fromId,
                    toArea: 0 /* HandArea */,
                    moveReason: 1 /* ActivePrey */,
                    proposer: event.fromId,
                    triggeredBySkills: [this.Name],
                }));
        }
        else {
            (_a = aimEvent.nullifiedTargets) === null || _a === void 0 ? void 0 : _a.push(event.fromId);
        }
        return true;
    }
};
SouYing = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'souying', description: 'souying_description' })
], SouYing);
exports.SouYing = SouYing;
let SouYingShadow = class SouYingShadow extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    getPriority() {
        return 0 /* High */;
    }
    isAutoTrigger() {
        return true;
    }
    isFlaggedSkill() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "AfterAim" /* AfterAim */;
    }
    canUse(room, owner, event) {
        var _a;
        return ((event.fromId !== owner.Id &&
            event.toId === owner.Id &&
            !((_a = owner.getFlag(this.GeneralName)) === null || _a === void 0 ? void 0 : _a.includes(event.fromId))) ||
            (event.fromId === owner.Id &&
                event.toId !== owner.Id &&
                !!aim_group_1.AimGroupUtil.getAllTargets(event.allTargets).find(playerId => { var _a; return !((_a = owner.getFlag(this.Name)) === null || _a === void 0 ? void 0 : _a.includes(playerId)); })));
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const aimEvent = event.triggeredOnEvent;
        if (aimEvent.fromId === event.fromId) {
            const originalPlayers = room.getFlag(event.fromId, this.Name) || [];
            originalPlayers.push(...algorithm_1.Algorithm.unique(aim_group_1.AimGroupUtil.getAllTargets(aimEvent.allTargets), originalPlayers));
            room.getPlayerById(event.fromId).setFlag(this.Name, originalPlayers);
            event_packer_1.EventPacker.addMiddleware({ tag: this.Name, data: originalPlayers }, aimEvent);
        }
        else {
            const originalPlayers = room.getFlag(event.fromId, this.GeneralName) || [];
            originalPlayers.push(aimEvent.fromId);
            room.getPlayerById(event.fromId).setFlag(this.GeneralName, originalPlayers);
            event_packer_1.EventPacker.addMiddleware({ tag: this.GeneralName, data: aimEvent.fromId }, aimEvent);
        }
        return true;
    }
};
SouYingShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: SouYing.Name, description: SouYing.Description })
], SouYingShadow);
exports.SouYingShadow = SouYingShadow;
let SouYingRemover = class SouYingRemover extends skill_1.TriggerSkill {
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
        return (event.from === 7 /* PhaseFinish */ &&
            (owner.getFlag(this.GeneralName) !== undefined ||
                owner.getFlag(SouYingShadow.Name) !== undefined));
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        room.getPlayerById(event.fromId).removeFlag(this.GeneralName);
        room.getPlayerById(event.fromId).removeFlag(SouYingShadow.Name);
        return true;
    }
};
SouYingRemover = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: SouYingShadow.Name, description: SouYingShadow.Description })
], SouYingRemover);
exports.SouYingRemover = SouYingRemover;
