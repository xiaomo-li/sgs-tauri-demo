"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZiShouShadow = exports.ZiShouPrevent = exports.ZiShouReforge = exports.ZiShou = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const precondition_1 = require("core/shares/libs/precondition/precondition");
const target_group_1 = require("core/shares/libs/utils/target_group");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let ZiShou = class ZiShou extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "CardDrawing" /* CardDrawing */;
    }
    canUse(room, owner, content) {
        return (owner.Id === content.fromId &&
            room.CurrentPlayerPhase === 3 /* DrawCardStage */ &&
            content.bySpecialReason === 0 /* GameStage */ &&
            content.drawAmount > 0);
    }
    getSkillLog(room, owner) {
        const nations = room.AlivePlayers.reduce((allNations, player) => {
            if (!allNations.includes(player.Nationality)) {
                allNations.push(player.Nationality);
            }
            return allNations;
        }, []);
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to draw {1} card(s) additionally?', this.Name, nations.length).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, triggeredOnEvent } = event;
        const drawCardEvent = triggeredOnEvent;
        const nations = room.AlivePlayers.reduce((allNations, player) => {
            if (!allNations.includes(player.Nationality)) {
                allNations.push(player.Nationality);
            }
            return allNations;
        }, []);
        drawCardEvent.drawAmount += nations.length;
        room.setFlag(fromId, this.Name, true);
        return true;
    }
};
ZiShou = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'zishou', description: 'zishou_description' })
], ZiShou);
exports.ZiShou = ZiShou;
let ZiShouReforge = class ZiShouReforge extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        return (content.playerId === owner.Id &&
            content.toStage === 19 /* FinishStageStart */ &&
            owner.getCardIds(0 /* HandArea */).length > 0 &&
            room.Analytics.getRecordEvents(event => event.fromId === owner.Id &&
                event.targetGroup !== undefined &&
                target_group_1.TargetGroupUtil.getRealTargets(event.targetGroup).find(player => player !== owner.Id) !== undefined, owner.Id, 'round', undefined, 1).length === 0);
    }
    cardFilter(room, owner, cards) {
        return cards.length > 0;
    }
    isAvailableCard(owner, room, cardId, selectedCards) {
        return ((selectedCards.length === 0 ||
            selectedCards.find(card => engine_1.Sanguosha.getCardById(card).Suit === engine_1.Sanguosha.getCardById(cardId).Suit) ===
                undefined) &&
            room.canDropCard(owner, cardId));
    }
    availableCardAreas() {
        return [0 /* HandArea */];
    }
    getSkillLog() {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to discard at least one card with different suits and draw cards?', this.GeneralName).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        event.cardIds = precondition_1.Precondition.exists(event.cardIds, 'Unable to get zishou cards');
        const { fromId, cardIds } = event;
        await room.dropCards(4 /* SelfDrop */, event.cardIds, event.fromId, event.fromId, this.Name);
        await room.drawCards(cardIds.length, fromId, 'top', fromId, this.GeneralName);
        return true;
    }
};
ZiShouReforge = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.CommonSkill({ name: ZiShou.Name, description: ZiShou.Description })
], ZiShouReforge);
exports.ZiShouReforge = ZiShouReforge;
let ZiShouPrevent = class ZiShouPrevent extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    isFlaggedSkill() {
        return true;
    }
    isAutoTrigger() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "DamageEffect" /* DamageEffect */;
    }
    canUse(room, owner, content) {
        return (content.fromId === owner.Id &&
            content.toId !== undefined &&
            content.toId !== owner.Id &&
            room.getFlag(owner.Id, this.GeneralName) === true);
    }
    async onTrigger(room, content) {
        const damageEvent = content.triggeredOnEvent;
        content.translationsMessage = translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} triggered skill {1}, prevent the damage to {2}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(damageEvent.fromId)), this.GeneralName, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(damageEvent.toId))).extract();
        return true;
    }
    async onEffect(room, event) {
        const damageEvent = event.triggeredOnEvent;
        event_packer_1.EventPacker.terminate(damageEvent);
        return true;
    }
};
ZiShouPrevent = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.CommonSkill({ name: ZiShouReforge.Name, description: ZiShouReforge.Description })
], ZiShouPrevent);
exports.ZiShouPrevent = ZiShouPrevent;
let ZiShouShadow = class ZiShouShadow extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    isFlaggedSkill() {
        return true;
    }
    isAutoTrigger() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "PhaseChanged" /* PhaseChanged */;
    }
    canUse(room, owner, content) {
        return content.from === 7 /* PhaseFinish */ && room.getFlag(owner.Id, this.GeneralName) === true;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        room.removeFlag(event.fromId, this.GeneralName);
        return true;
    }
};
ZiShouShadow = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.CommonSkill({ name: ZiShouPrevent.Name, description: ZiShouPrevent.Description })
], ZiShouShadow);
exports.ZiShouShadow = ZiShouShadow;
