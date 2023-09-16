"use strict";
var XianSiShadow_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.XianSiSlashShadow = exports.XianSiSlash = exports.XianSiShadow = exports.XianSi = void 0;
const tslib_1 = require("tslib");
const card_1 = require("core/cards/card");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const target_group_1 = require("core/shares/libs/utils/target_group");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let XianSi = class XianSi extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */ && event.toStage === 3 /* PrepareStageStart */;
    }
    canUse(room, owner, content) {
        return content.playerId === owner.Id;
    }
    targetFilter(room, owner, targets) {
        return targets.length >= 1 && targets.length <= 2;
    }
    isAvailableTarget(owner, room, target) {
        return owner !== target && room.getPlayerById(target).getCardIds().length > 0;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { toIds, fromId } = event;
        for (const toId of toIds) {
            const options = {
                [1 /* EquipArea */]: room.getPlayerById(toId).getCardIds(1 /* EquipArea */),
                [0 /* HandArea */]: room.getPlayerById(toId).getCardIds(0 /* HandArea */).length,
            };
            const askForChoosingCardEvent = {
                fromId,
                toId,
                options,
                triggeredBySkills: [this.Name],
            };
            room.notify(170 /* AskForChoosingCardFromPlayerEvent */, event_packer_1.EventPacker.createUncancellableEvent(askForChoosingCardEvent), fromId);
            const response = await room.onReceivingAsyncResponseFrom(170 /* AskForChoosingCardFromPlayerEvent */, event.fromId);
            if (response.selectedCard === undefined) {
                const cardIds = room.getPlayerById(toId).getCardIds(0 /* HandArea */);
                response.selectedCard = cardIds[Math.floor(Math.random() * cardIds.length)];
            }
            await room.moveCards({
                movingCards: [{ card: response.selectedCard, fromArea: response.fromArea }],
                fromId: toId,
                moveReason: 1 /* ActivePrey */,
                toId: fromId,
                toArea: 3 /* OutsideArea */,
                isOutsideAreaInPublic: true,
                toOutsideArea: this.Name,
            });
        }
        return true;
    }
};
XianSi = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'xiansi', description: 'xiansi_description' })
], XianSi);
exports.XianSi = XianSi;
let XianSiShadow = XianSiShadow_1 = class XianSiShadow extends skill_1.TriggerSkill {
    isAutoTrigger() {
        return true;
    }
    isFlaggedSkill() {
        return true;
    }
    async whenLosingSkill(room) {
        room.uninstallSideEffectSkill(2 /* XianSi */);
    }
    async whenObtainingSkill(room, owner) {
        room.installSideEffectSkill(2 /* XianSi */, XianSiShadow_1.Name, owner.Id);
    }
    isTriggerable(event, stage) {
        return stage === "BeforeGameStart" /* BeforeGameStart */;
    }
    canUse() {
        return true;
    }
    async onTrigger(room, event) {
        event.translationsMessage = undefined;
        return true;
    }
    async onEffect(room, event) {
        room.installSideEffectSkill(2 /* XianSi */, XianSiSlash.Name, event.fromId);
        return true;
    }
};
XianSiShadow = XianSiShadow_1 = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.CommonSkill({ name: XianSi.Name, description: XianSi.Description })
], XianSiShadow);
exports.XianSiShadow = XianSiShadow;
let XianSiSlash = class XianSiSlash extends skill_1.ViewAsSkill {
    canUse(room, owner, contentOrContainerCard) {
        // Now SideEffectSkill Don't Support Multiple Same Skill
        // See in room.ts
        const target = room
            .getOtherPlayers(owner.Id)
            .find(player => player.getCardIds(3 /* OutsideArea */, XianSi.Name).length >= 2);
        if (target === undefined) {
            return false;
        }
        if (typeof contentOrContainerCard === 'object') {
            const identifier = event_packer_1.EventPacker.getIdentifier(contentOrContainerCard);
            switch (identifier) {
                case 157 /* AskForPlayCardsOrSkillsEvent */:
                    return owner.canUseCardTo(room, new card_matcher_1.CardMatcher({ generalName: ['slash'] }), target.Id);
                case 159 /* AskForCardResponseEvent */:
                case 160 /* AskForCardUseEvent */:
                    const content = contentOrContainerCard;
                    return (content.toId === target.Id &&
                        card_matcher_1.CardMatcher.match(content.cardMatcher, new card_matcher_1.CardMatcher({ generalName: ['slash'] })));
                default:
            }
        }
        return owner.canUseCard(room, new card_matcher_1.CardMatcher({ generalName: ['slash'] }));
    }
    canViewAs() {
        return ['slash'];
    }
    viewAs() {
        return card_1.VirtualCard.create({ cardName: 'slash', cardSuit: 0 /* NoSuit */, bySkill: XianSi.Name });
    }
    isAvailableCard() {
        return false;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 0;
    }
};
XianSiSlash = tslib_1.__decorate([
    skill_wrappers_1.SideEffectSkill,
    skill_wrappers_1.CommonSkill({ name: XianSi.GeneralName, description: XianSi.Description })
], XianSiSlash);
exports.XianSiSlash = XianSiSlash;
let XianSiSlashShadow = class XianSiSlashShadow extends skill_1.TriggerSkill {
    isAutoTrigger() {
        return true;
    }
    get Muted() {
        return true;
    }
    isTriggerable(event, stage) {
        return ((stage === "PreCardUse" /* PreCardUse */ || stage === "PreCardResponse" /* PreCardResponse */) &&
            card_1.Card.isVirtualCardId(event.cardId));
    }
    canUse(room, owner, content) {
        return engine_1.Sanguosha.getCardById(content.cardId).findByGeneratedSkill(XianSi.Name);
    }
    async onTrigger(room, event) {
        event.translationsMessage = undefined;
        return true;
    }
    async onEffect(room, event) {
        const actualEvent = event.triggeredOnEvent;
        let fromId;
        let toId;
        if (event_packer_1.EventPacker.getIdentifier(actualEvent) === 124 /* CardUseEvent */) {
            fromId = actualEvent.fromId;
            toId = target_group_1.TargetGroupUtil.getRealTargets(actualEvent.targetGroup)[0];
        }
        else if (event_packer_1.EventPacker.getIdentifier(actualEvent) === 123 /* CardResponseEvent */) {
            fromId = actualEvent.fromId;
            toId = target_group_1.TargetGroupUtil.getRealTargets(actualEvent.targetGroup)[0];
        }
        else {
            throw new Error('xiansi drop cards for slash failed');
        }
        const niCards = room.getPlayerById(toId).getCardIds(3 /* OutsideArea */, XianSi.GeneralName);
        const askForChooseCardEvent = {
            toId: fromId,
            cardIds: niCards,
            amount: 2,
            triggeredBySkills: [this.GeneralName],
        };
        room.notify(165 /* AskForChoosingCardEvent */, askForChooseCardEvent, fromId);
        const { selectedCards } = await room.onReceivingAsyncResponseFrom(165 /* AskForChoosingCardEvent */, fromId);
        const actualCards = selectedCards ? selectedCards : niCards.slice(0, 2);
        await room.moveCards({
            movingCards: actualCards.map(card => ({ card, fromArea: 3 /* OutsideArea */ })),
            fromId: toId,
            moveReason: 6 /* PlaceToDropStack */,
            toArea: 4 /* DropStack */,
            proposer: fromId,
            movedByReason: this.GeneralName,
        });
        return true;
    }
};
XianSiSlashShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: XianSiSlash.Name, description: XianSiSlash.Description })
], XianSiSlashShadow);
exports.XianSiSlashShadow = XianSiSlashShadow;
