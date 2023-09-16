"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BiLuanDistance = exports.BiLuan = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let BiLuan = class BiLuan extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        return (owner.Id === content.playerId &&
            19 /* FinishStageStart */ === content.toStage &&
            owner.getPlayerCards().length > 0 &&
            room.getOtherPlayers(owner.Id).find(player => room.distanceBetween(player, owner) === 1) !== undefined);
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    isAvailableCard(owner, room, cardId) {
        return room.canDropCard(owner, cardId);
    }
    getSkillLog(room, owner) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to drop a card to let others calculate the distance to you increase {1}', this.Name, Math.min(room.AlivePlayers.length, 4)).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, cardIds } = event;
        if (!cardIds) {
            return false;
        }
        await room.dropCards(4 /* SelfDrop */, cardIds, fromId, fromId, this.Name);
        let originalDistance = room.getFlag(fromId, this.Name) || 0;
        originalDistance += Math.min(room.AlivePlayers.length, 4);
        room.setFlag(fromId, this.Name, originalDistance, originalDistance !== 0
            ? translation_json_tool_1.TranslationPack.translationJsonPatcher(originalDistance > 0 ? 'distance buff: {0}' : 'distance debuff: {0}', originalDistance).toString()
            : undefined);
        room.getPlayerById(fromId).hasShadowSkill(BiLuanDistance.Name) ||
            (await room.obtainSkill(fromId, BiLuanDistance.Name));
        return true;
    }
};
BiLuan = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'biluan', description: 'biluan_description' })
], BiLuan);
exports.BiLuan = BiLuan;
let BiLuanDistance = class BiLuanDistance extends skill_1.RulesBreakerSkill {
    breakDefenseDistance(room, owner) {
        return owner.getFlag(BiLuan.Name) || 0;
    }
};
BiLuanDistance = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: 's_biluan_distance', description: 's_biluan_distance_description' })
], BiLuanDistance);
exports.BiLuanDistance = BiLuanDistance;
