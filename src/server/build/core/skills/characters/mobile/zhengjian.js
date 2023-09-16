"use strict";
var ZhengJian_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZhengJianRecorder = exports.ZhengJianShadow = exports.ZhengJian = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let ZhengJian = ZhengJian_1 = class ZhengJian extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        return content.playerId === owner.Id && content.toStage === 19 /* FinishStageStart */;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const players = room.getOtherPlayers(event.fromId).map(player => player.Id);
        const response = await room.doAskForCommonly(167 /* AskForChoosingPlayerEvent */, {
            players,
            toId: event.fromId,
            requiredAmount: 1,
            conversation: 'zhengjian: please choose a target to gain ‘Jian’',
            triggeredBySkills: [this.Name],
        }, event.fromId, true);
        const toId = (response.selectedPlayers || [players[Math.floor(Math.random() * players.length)]])[0];
        const originalTargets = room.getFlag(event.fromId, ZhengJian_1.Targets) || [];
        originalTargets.includes(toId) || originalTargets.push(toId);
        room.getPlayerById(event.fromId).setFlag(ZhengJian_1.Targets, originalTargets);
        room.getFlag(toId, this.Name) === undefined &&
            room.setFlag(toId, this.Name, 0, translation_json_tool_1.TranslationPack.translationJsonPatcher('zhengjian count: {0}', 0).toString());
        room.getPlayerById(toId).hasShadowSkill(ZhengJianRecorder.Name) ||
            (await room.obtainSkill(toId, ZhengJianRecorder.Name));
        return true;
    }
};
ZhengJian.Targets = 'zhengjian_targets';
ZhengJian = ZhengJian_1 = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'zhengjian', description: 'zhengjian_description' })
], ZhengJian);
exports.ZhengJian = ZhengJian;
let ZhengJianShadow = class ZhengJianShadow extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return (room.CurrentPlayer === room.getPlayerById(owner) &&
            room.CurrentPlayerPhase === 0 /* PhaseBegin */ &&
            stage === "AfterPhaseChanged" /* AfterPhaseChanged */);
    }
    async whenDead(room, player) {
        const toIds = player.getFlag(this.GeneralName);
        if (toIds) {
            for (const toId of toIds) {
                room.removeFlag(toId, this.GeneralName);
                await room.loseSkill(toId, ZhengJianRecorder.Name);
            }
        }
        player.removeFlag(ZhengJian.Targets);
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
        return (owner.Id === event.toPlayer &&
            event.to === 0 /* PhaseBegin */ &&
            owner.getFlag(ZhengJian.Targets) !== undefined);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const toIds = room.getFlag(event.fromId, ZhengJian.Targets);
        if (!toIds) {
            return false;
        }
        for (const toId of toIds) {
            if (!room.getPlayerById(toId).Dead) {
                const count = room.getFlag(toId, this.GeneralName);
                if (count !== undefined) {
                    await room.drawCards(Math.min(count, Math.min(room.getPlayerById(toId).MaxHp, 5)), event.fromId, 'top', event.fromId, this.Name);
                    room.removeFlag(toId, this.GeneralName);
                    await room.loseSkill(toId, ZhengJianRecorder.Name);
                }
            }
        }
        return true;
    }
};
ZhengJianShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: ZhengJian.Name, description: ZhengJian.Description })
], ZhengJianShadow);
exports.ZhengJianShadow = ZhengJianShadow;
let ZhengJianRecorder = class ZhengJianRecorder extends skill_1.TriggerSkill {
    async whenLosingSkill(room, player) {
        room.removeFlag(player.Id, ZhengJian.Name);
    }
    async whenDead(room, player) {
        await room.loseSkill(player.Id, this.Name);
    }
    isAutoTrigger() {
        return true;
    }
    isFlaggedSkill() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "BeforeCardUseEffect" /* BeforeCardUseEffect */ || stage === "BeforeCardResponseEffect" /* BeforeCardResponseEffect */;
    }
    canUse(room, owner, event) {
        return owner.getFlag(ZhengJian.Name) !== undefined && event.fromId === owner.Id;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const originalCount = room.getFlag(event.fromId, ZhengJian.Name) || 0;
        room.setFlag(event.fromId, ZhengJian.Name, originalCount + 1, translation_json_tool_1.TranslationPack.translationJsonPatcher('zhengjian count: {0}', originalCount + 1).toString());
        return true;
    }
};
ZhengJianRecorder = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: 's_zhengjian_recorder', description: 's_zhengjian_recorder_description' })
], ZhengJianRecorder);
exports.ZhengJianRecorder = ZhengJianRecorder;
