"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TunChuShadow = exports.TunChuDebuff = exports.TunChu = void 0;
const tslib_1 = require("tslib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let TunChu = class TunChu extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "CardDrawing" /* CardDrawing */;
    }
    isRefreshAt(room, owner, stage) {
        return stage === 3 /* DrawCardStage */;
    }
    canUse(room, owner, content) {
        return (owner.Id === content.fromId &&
            room.CurrentPlayerPhase === 3 /* DrawCardStage */ &&
            content.bySpecialReason === 0 /* GameStage */ &&
            content.drawAmount > 0 &&
            owner.getCardIds(3 /* OutsideArea */, this.Name).length === 0);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const { triggeredOnEvent } = skillUseEvent;
        const drawCardEvent = triggeredOnEvent;
        drawCardEvent.drawAmount += 2;
        return true;
    }
};
TunChu = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'tunchu', description: 'tunchu_description' })
], TunChu);
exports.TunChu = TunChu;
let TunChuDebuff = class TunChuDebuff extends skill_1.FilterSkill {
    canUseCard(cardId, room, owner, onResponse, isCardResponse) {
        if (room.getPlayerById(owner).getCardIds(3 /* OutsideArea */, this.GeneralName).length === 0 ||
            isCardResponse) {
            return true;
        }
        return cardId instanceof card_matcher_1.CardMatcher
            ? !cardId.match(new card_matcher_1.CardMatcher({ generalName: ['slash'] }))
            : engine_1.Sanguosha.getCardById(cardId).GeneralName !== 'slash';
    }
};
TunChuDebuff = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.CommonSkill({ name: TunChu.Name, description: TunChu.Description })
], TunChuDebuff);
exports.TunChuDebuff = TunChuDebuff;
let TunChuShadow = class TunChuShadow extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return (room.CurrentPlayerStage === 12 /* DrawCardStageEnd */ && stage === "StageChanged" /* StageChanged */);
    }
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        return (owner.Id === content.playerId &&
            content.toStage === 12 /* DrawCardStageEnd */ &&
            owner.hasUsedSkill(this.GeneralName) &&
            owner.getCardIds(0 /* HandArea */).length > 0);
    }
    cardFilter(room, owner, cards) {
        return cards.length > 0;
    }
    isAvailableCard() {
        return true;
    }
    availableCardAreas() {
        return [0 /* HandArea */];
    }
    getSkillLog(room, owner) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to put at least 1 hand card on your general card as ‘liang’?', this.GeneralName).extract();
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        if (!event.cardIds) {
            return false;
        }
        event.cardIds.length > 0 &&
            (await room.moveCards({
                movingCards: event.cardIds.map(card => ({ card, fromArea: 0 /* HandArea */ })),
                fromId: event.fromId,
                toId: event.fromId,
                toArea: 3 /* OutsideArea */,
                moveReason: 2 /* ActiveMove */,
                proposer: event.fromId,
                isOutsideAreaInPublic: true,
                toOutsideArea: this.GeneralName,
                triggeredBySkills: [this.GeneralName],
            }));
        return true;
    }
};
TunChuShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: TunChuDebuff.Name, description: TunChuDebuff.Description })
], TunChuShadow);
exports.TunChuShadow = TunChuShadow;
