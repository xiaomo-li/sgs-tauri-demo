"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HaoShiShadow = exports.HaoShi = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let HaoShi = class HaoShi extends skill_1.TriggerSkill {
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
            content.drawAmount > 0);
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
HaoShi = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'haoshi', description: 'haoshi_description' })
], HaoShi);
exports.HaoShi = HaoShi;
let HaoShiShadow = class HaoShiShadow extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "BeforeStageChange" /* BeforeStageChange */;
    }
    isUncancellable() {
        return true;
    }
    canUse(room, owner, content) {
        return (owner.Id === content.playerId &&
            content.toStage === 12 /* DrawCardStageEnd */ &&
            owner.hasUsedSkill(this.GeneralName) &&
            owner.getCardIds(0 /* HandArea */).length > 5);
    }
    numberOfTargets() {
        return 1;
    }
    getSkillLog(room, owner) {
        return translation_json_tool_1.TranslationPack.translationJsonPatcher('please choose {0} handcards and give them to a target', Math.floor(owner.getCardIds(0 /* HandArea */).length / 2)).extract();
    }
    isAvailableTarget(owner, room, target) {
        const handcardsNum = room.getPlayerById(target).getCardIds(0 /* HandArea */).length;
        return (target !== owner &&
            !room.getOtherPlayers(owner).find(player => player.getCardIds(0 /* HandArea */).length < handcardsNum));
    }
    cardFilter(room, owner, cards) {
        return cards.length === Math.floor(owner.getCardIds(0 /* HandArea */).length / 2);
    }
    isAvailableCard(owner, room, cardId, selectedCards, selectedTargets, containerCard) {
        return true;
    }
    availableCardAreas() {
        return [0 /* HandArea */];
    }
    async onTrigger(room, skillUseEvent) {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const { toIds, cardIds, fromId } = skillUseEvent;
        await room.moveCards({
            movingCards: cardIds.map(card => ({ card, fromArea: 0 /* HandArea */ })),
            fromId,
            toId: toIds[0],
            toArea: 0 /* HandArea */,
            moveReason: 2 /* ActiveMove */,
            proposer: fromId,
            movedByReason: this.GeneralName,
            engagedPlayerIds: [toIds[0], fromId],
        });
        return true;
    }
};
HaoShiShadow = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.CommonSkill({ name: HaoShi.GeneralName, description: HaoShi.Description })
], HaoShiShadow);
exports.HaoShiShadow = HaoShiShadow;
