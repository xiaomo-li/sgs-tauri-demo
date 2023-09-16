"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZhenGuShadow = exports.ZhenGu = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let ZhenGu = class ZhenGu extends skill_1.TriggerSkill {
    async whenDead(room, player) {
        for (const other of room.getOtherPlayers(player.Id)) {
            const originalPlayers = room.getFlag(other.Id, this.Name);
            if (!originalPlayers) {
                continue;
            }
            const index = originalPlayers.findIndex(p => p === player.Id);
            originalPlayers.splice(index, 1);
            if (originalPlayers.length === 0) {
                room.removeFlag(other.Id, this.Name);
            }
            else {
                room.setFlag(other.Id, this.Name, originalPlayers, translation_json_tool_1.TranslationPack.translationJsonPatcher('zhengu sources: {0}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(...originalPlayers.map(playerId => room.getPlayerById(playerId)))).toString());
            }
        }
    }
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        return content.playerId === owner.Id && content.toStage === 19 /* FinishStageStart */;
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, target) {
        return target !== owner;
    }
    getSkillLog() {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to choose a target to draw or drop hand cards until the number of hand cards equal to you?', this.Name).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, toIds } = event;
        if (!toIds) {
            return false;
        }
        const opponentsHands = room.getPlayerById(toIds[0]).getCardIds(0 /* HandArea */);
        const n = room.getPlayerById(fromId).getCardIds(0 /* HandArea */).length - opponentsHands.length;
        if (n > 0) {
            await room.drawCards(Math.min(n, 5 - opponentsHands.length), toIds[0], 'top', fromId, this.Name);
        }
        else if (n < 0) {
            if (n === -opponentsHands.length) {
                await room.dropCards(4 /* SelfDrop */, opponentsHands, toIds[0], toIds[0], this.Name);
            }
            else {
                const response = await room.askForCardDrop(toIds[0], -n, [0 /* HandArea */], true, undefined, this.Name);
                response.droppedCards.length > 0 &&
                    (await room.dropCards(4 /* SelfDrop */, response.droppedCards, toIds[0], toIds[0], this.Name));
            }
        }
        const originalPlayers = room.getFlag(toIds[0], this.Name) || [];
        originalPlayers.push(fromId);
        room.setFlag(toIds[0], this.Name, originalPlayers, translation_json_tool_1.TranslationPack.translationJsonPatcher('zhengu sources: {0}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(...originalPlayers.map(playerId => room.getPlayerById(playerId)))).toString());
        return true;
    }
};
ZhenGu = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'zhengu', description: 'zhengu_description' })
], ZhenGu);
exports.ZhenGu = ZhenGu;
let ZhenGuShadow = class ZhenGuShadow extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        var _a;
        return (room.CurrentPlayerPhase === 7 /* PhaseFinish */ &&
            stage === "PhaseChanged" /* PhaseChanged */ &&
            ((_a = room.CurrentPlayer.getFlag(this.GeneralName)) === null || _a === void 0 ? void 0 : _a.includes(owner)));
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
        var _a;
        return (content.fromPlayer !== undefined &&
            content.from === 7 /* PhaseFinish */ &&
            ((_a = room.getPlayerById(content.fromPlayer).getFlag(this.GeneralName)) === null || _a === void 0 ? void 0 : _a.includes(owner.Id)));
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, triggeredOnEvent } = event;
        const target = triggeredOnEvent.fromPlayer;
        if (!target) {
            return false;
        }
        const opponentsHands = room.getPlayerById(target).getCardIds(0 /* HandArea */);
        const n = room.getPlayerById(fromId).getCardIds(0 /* HandArea */).length - opponentsHands.length;
        if (n > 0) {
            await room.drawCards(Math.min(n, 5 - opponentsHands.length), target, 'top', fromId, this.GeneralName);
        }
        else if (n < 0) {
            if (n === -opponentsHands.length) {
                await room.dropCards(4 /* SelfDrop */, opponentsHands, target, target, this.GeneralName);
            }
            else {
                const response = await room.askForCardDrop(target, -n, [0 /* HandArea */], true, undefined, this.GeneralName);
                response.droppedCards.length > 0 &&
                    (await room.dropCards(4 /* SelfDrop */, response.droppedCards, target, target, this.GeneralName));
            }
        }
        const originalPlayers = room.getFlag(target, this.GeneralName);
        const index = originalPlayers.findIndex(player => player === fromId);
        originalPlayers.splice(index, 1);
        if (originalPlayers.length === 0) {
            room.removeFlag(target, this.GeneralName);
        }
        else {
            room.setFlag(target, this.GeneralName, originalPlayers, translation_json_tool_1.TranslationPack.translationJsonPatcher('zhengu sources: {0}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(...originalPlayers.map(playerId => room.getPlayerById(playerId)))).toString());
        }
        return true;
    }
};
ZhenGuShadow = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.PersistentSkill(),
    skill_1.CommonSkill({ name: ZhenGu.Name, description: ZhenGu.Description })
], ZhenGuShadow);
exports.ZhenGuShadow = ZhenGuShadow;
