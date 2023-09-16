"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TiaoXinShadow = exports.TiaoXin = void 0;
const tslib_1 = require("tslib");
const tiaoxin_1 = require("core/ai/skills/characters/mountain/tiaoxin");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let TiaoXin = class TiaoXin extends skill_1.ActiveSkill {
    get RelatedCharacters() {
        return ['sp_jiangwei', 'xiahouba'];
    }
    canUse(room, owner, containerCard) {
        return owner.getFlag(this.Name) ? owner.hasUsedSkillTimes(this.Name) < 2 : !owner.hasUsedSkill(this.Name);
    }
    isRefreshAt(room, owner, phase) {
        return phase === 4 /* PlayCardStage */;
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, target) {
        return room.withinAttackDistance(room.getPlayerById(target), room.getPlayerById(owner));
    }
    cardFilter() {
        return true;
    }
    isAvailableCard() {
        return false;
    }
    async onUse(room, skillUseEvent) {
        return true;
    }
    async onEffect(room, skillEffectEvent) {
        const { fromId, toIds } = skillEffectEvent;
        const toId = toIds[0];
        const from = room.getPlayerById(fromId);
        const response = await room.askForCardUse({
            toId,
            cardUserId: toId,
            scopedTargets: [fromId],
            cardMatcher: new card_matcher_1.CardMatcher({ generalName: ['slash'] }).toSocketPassenger(),
            extraUse: true,
            commonUse: true,
            conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('tiaoxin: you are provoked by {0}, do you wanna use slash to {0}?', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(from)).extract(),
            triggeredBySkills: [this.Name],
        }, toId);
        let option2 = true;
        const to = room.getPlayerById(toId);
        if (response.cardId !== undefined) {
            const slashUseEvent = {
                fromId: response.fromId,
                targetGroup: response.toIds && [response.toIds],
                cardId: response.cardId,
                triggeredBySkills: [this.Name],
            };
            await room.useCard(slashUseEvent, true);
            option2 =
                room.Analytics.getRecordEvents(event => event_packer_1.EventPacker.getIdentifier(event) === 137 /* DamageEvent */ &&
                    event.cardIds !== undefined &&
                    event.cardIds[0] === response.cardId &&
                    event.triggeredBySkills.includes(this.Name) &&
                    event.toId === fromId, undefined, 'phase', undefined, 1).length === 0;
        }
        if (option2) {
            if (to.getPlayerCards().length > 0) {
                const options = {
                    [1 /* EquipArea */]: to.getCardIds(1 /* EquipArea */),
                    [0 /* HandArea */]: to.getCardIds(0 /* HandArea */).length,
                };
                const chooseCardEvent = {
                    fromId,
                    toId,
                    options,
                    triggeredBySkills: [this.Name],
                };
                const resp = await room.askForChoosingPlayerCard(chooseCardEvent, fromId, true, true);
                if (!resp) {
                    return false;
                }
                await room.dropCards(5 /* PassiveDrop */, [resp.selectedCard], chooseCardEvent.toId, chooseCardEvent.fromId, this.Name);
            }
            room.setFlag(fromId, this.Name, true);
        }
        return true;
    }
};
TiaoXin = tslib_1.__decorate([
    skill_wrappers_1.AI(tiaoxin_1.TiaoXinSkillTrigger),
    skill_wrappers_1.CommonSkill({ name: 'tiaoxin', description: 'tiaoxin_description' })
], TiaoXin);
exports.TiaoXin = TiaoXin;
let TiaoXinShadow = class TiaoXinShadow extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 4 /* PlayCardStage */ && stage === "PhaseChanged" /* PhaseChanged */;
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
        return (owner.Id === event.fromPlayer &&
            event.from === 4 /* PlayCardStage */ &&
            owner.getFlag(this.GeneralName) !== undefined);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        room.removeFlag(event.fromId, this.GeneralName);
        return true;
    }
};
TiaoXinShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: TiaoXin.Name, description: TiaoXin.Description })
], TiaoXinShadow);
exports.TiaoXinShadow = TiaoXinShadow;
