"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChouTaoShadow = exports.ChouTao = void 0;
const tslib_1 = require("tslib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let ChouTao = class ChouTao extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterAim" /* AfterAim */ || stage === "AfterAimmed" /* AfterAimmed */;
    }
    canUse(room, owner, event, stage) {
        if (engine_1.Sanguosha.getCardById(event.byCardId).GeneralName !== 'slash') {
            return false;
        }
        if (stage === "AfterAim" /* AfterAim */) {
            return (event.fromId === owner.Id &&
                event.isFirstTarget &&
                !!owner.getPlayerCards().find(cardId => room.canDropCard(owner.Id, cardId)));
        }
        else {
            return (event.fromId !== owner.Id &&
                event.toId === owner.Id &&
                room.getPlayerById(event.fromId).getPlayerCards().length > 0);
        }
    }
    getSkillLog(room, owner, event) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher(`{0}: do you want to discard a card from {1} to set {2} Unoffsetable${event.fromId === owner.Id ? ' and restore your limit of using slash' : ''}?`, this.Name, translation_json_tool_1.TranslationPack.patchCardInTranslation(event.byCardId), translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(event.fromId))).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const aimEvent = event.triggeredOnEvent;
        const user = aimEvent.fromId;
        const userPlayer = room.getPlayerById(user);
        const options = {
            [1 /* EquipArea */]: userPlayer.getCardIds(1 /* EquipArea */),
            [0 /* HandArea */]: userPlayer.getCardIds(0 /* HandArea */).length,
        };
        const chooseCardEvent = {
            fromId: event.fromId,
            toId: user,
            options,
            triggeredBySkills: [this.Name],
        };
        const response = await room.askForChoosingPlayerCard(chooseCardEvent, event.fromId, true, true);
        if (!response) {
            return false;
        }
        await room.dropCards(5 /* PassiveDrop */, [response.selectedCard], user, event.fromId, this.Name);
        event_packer_1.EventPacker.setUnoffsetableEvent(aimEvent);
        if (user === event.fromId) {
            room.syncGameCommonRules(event.fromId, user => {
                room.CommonRules.addCardUsableTimes(new card_matcher_1.CardMatcher({ generalName: ['slash'] }), 1, user);
                user.addInvisibleMark(this.Name, 1);
            });
        }
        return true;
    }
};
ChouTao = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'choutao', description: 'choutao_description' })
], ChouTao);
exports.ChouTao = ChouTao;
let ChouTaoShadow = class ChouTaoShadow extends skill_1.TriggerSkill {
    get Muted() {
        return true;
    }
    isFlaggedSkill() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "AfterStageChanged" /* AfterStageChanged */;
    }
    isAutoTrigger() {
        return true;
    }
    afterLosingSkill(room) {
        return room.CurrentPlayerStage === 15 /* PlayCardStageEnd */;
    }
    afterDead(room) {
        return room.CurrentPlayerStage === 15 /* PlayCardStageEnd */;
    }
    clearChouTaoHistory(room, from) {
        const extraUse = from.getInvisibleMark(this.GeneralName);
        if (extraUse === 0) {
            return;
        }
        room.syncGameCommonRules(from.Id, user => {
            room.CommonRules.addCardUsableTimes(new card_matcher_1.CardMatcher({ generalName: ['slash'] }), -extraUse, user);
            user.removeInvisibleMark(this.GeneralName);
        });
    }
    canUse(room, owner, content) {
        return content.toStage === 15 /* PlayCardStageEnd */ && owner.getInvisibleMark(this.GeneralName) > 0;
    }
    async onTrigger(room, event) {
        return true;
    }
    async onEffect(room, event) {
        this.clearChouTaoHistory(room, room.getPlayerById(event.fromId));
        return true;
    }
};
ChouTaoShadow = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.PersistentSkill(),
    skill_1.CommonSkill({ name: ChouTao.Name, description: ChouTao.Description })
], ChouTaoShadow);
exports.ChouTaoShadow = ChouTaoShadow;
