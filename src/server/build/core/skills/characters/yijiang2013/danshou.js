"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DanshouShadow = exports.DanShou = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const target_group_1 = require("core/shares/libs/utils/target_group");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let DanShou = class DanShou extends skill_1.TriggerSkill {
    isRefreshAt(room, owner, stage) {
        return stage === 0 /* PhaseBegin */;
    }
    isTriggerable(event, stage) {
        return stage === "AfterAimmed" /* AfterAimmed */;
    }
    canUse(room, owner, content) {
        return (!owner.hasUsedSkill(this.Name) &&
            content.toId === owner.Id &&
            (engine_1.Sanguosha.getCardById(content.byCardId).is(0 /* Basic */) ||
                engine_1.Sanguosha.getCardById(content.byCardId).is(7 /* Trick */)));
    }
    //TODO: need to refactor
    getSkillLog(room, owner, event) {
        const drawNum = room.Analytics.getRecordEvents(event => {
            if (event_packer_1.EventPacker.getIdentifier(event) !== 124 /* CardUseEvent */) {
                return false;
            }
            const cardUseEvent = event;
            return (cardUseEvent.targetGroup !== undefined &&
                target_group_1.TargetGroupUtil.getRealTargets(cardUseEvent.targetGroup).find(player => player === owner.Id) !== undefined &&
                (engine_1.Sanguosha.getCardById(cardUseEvent.cardId).is(0 /* Basic */) ||
                    engine_1.Sanguosha.getCardById(cardUseEvent.cardId).is(7 /* Trick */)));
        }, undefined, 'round').length;
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to draw {1} card(s)?', this.Name, drawNum).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const { fromId } = skillUseEvent;
        const drawNum = room.Analytics.getRecordEvents(event => {
            if (event_packer_1.EventPacker.getIdentifier(event) !== 124 /* CardUseEvent */) {
                return false;
            }
            const cardUseEvent = event;
            return (cardUseEvent.targetGroup !== undefined &&
                target_group_1.TargetGroupUtil.getRealTargets(cardUseEvent.targetGroup).find(player => player === fromId) !== undefined &&
                (engine_1.Sanguosha.getCardById(cardUseEvent.cardId).is(0 /* Basic */) ||
                    engine_1.Sanguosha.getCardById(cardUseEvent.cardId).is(7 /* Trick */)));
        }, undefined, 'round').length;
        await room.drawCards(drawNum, fromId, undefined, fromId, this.Name);
        return true;
    }
};
DanShou = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'danshou', description: 'danshou_description' })
], DanShou);
exports.DanShou = DanShou;
let DanshouShadow = class DanshouShadow extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        return content.toStage === 19 /* FinishStageStart */ && !owner.hasUsedSkill(this.GeneralName);
    }
    isAvailableCard(owner, room, cardId) {
        return room.canDropCard(owner, cardId);
    }
    cardFilter(room, owner, cards) {
        return cards.length === room.CurrentPhasePlayer.getCardIds(0 /* HandArea */).length;
    }
    getSkillLog(room, owner, event) {
        const currentHandNum = room.CurrentPhasePlayer.getCardIds(0 /* HandArea */).length;
        return currentHandNum > 0
            ? translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to drop {1} card(s) to deal 1 damage to {2} ?', this.GeneralName, currentHandNum, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.CurrentPhasePlayer)).extract()
            : translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to deal 1 damage to {1} ?', this.GeneralName, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.CurrentPhasePlayer)).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const { fromId, cardIds } = skillUseEvent;
        if (cardIds !== undefined && cardIds.length > 0) {
            await room.dropCards(4 /* SelfDrop */, cardIds, fromId, fromId, this.GeneralName);
        }
        const current = room.CurrentPhasePlayer;
        if (!current.Dead) {
            await room.damage({
                fromId,
                toId: current.Id,
                damage: 1,
                damageType: "normal_property" /* Normal */,
                triggeredBySkills: [this.GeneralName],
            });
        }
        return true;
    }
};
DanshouShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.CommonSkill({ name: DanShou.Name, description: DanShou.Description })
], DanshouShadow);
exports.DanshouShadow = DanshouShadow;
