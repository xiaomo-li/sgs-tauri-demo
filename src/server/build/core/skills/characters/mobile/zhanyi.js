"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZhanYiSide = exports.ZhanYiShadow = exports.ZhanYi = void 0;
const tslib_1 = require("tslib");
const card_1 = require("core/cards/card");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const wuxiekeji_1 = require("core/cards/standard/wuxiekeji");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const functional_1 = require("core/shares/libs/functional");
const precondition_1 = require("core/shares/libs/precondition/precondition");
const aim_group_1 = require("core/shares/libs/utils/aim_group");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let ZhanYi = class ZhanYi extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return !owner.hasUsedSkill(this.Name) && owner.getPlayerCards().length > 0;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    numberOfTargets() {
        return 0;
    }
    isAvailableTarget() {
        return false;
    }
    isAvailableCard(owner, room, cardId) {
        return room.canDropCard(owner, cardId);
    }
    async onUse(room, event) {
        return true;
    }
    async onEffect(room, event) {
        if (!event.cardIds) {
            return false;
        }
        const typeDiscarded = engine_1.Sanguosha.getCardById(event.cardIds[0]).BaseType;
        await room.dropCards(4 /* SelfDrop */, event.cardIds, event.fromId, event.fromId, this.Name);
        await room.loseHp(event.fromId, 1);
        if (!room.getPlayerById(event.fromId).Dead) {
            room.setFlag(event.fromId, this.Name, typeDiscarded, translation_json_tool_1.TranslationPack.translationJsonPatcher('zhanyi: {0}', functional_1.Functional.getCardBaseTypeAbbrRawText(typeDiscarded)).toString());
            if (typeDiscarded === 0 /* Basic */) {
                room.installSideEffectSkill(6 /* ZhanYi */, ZhanYiSide.Name, event.fromId);
            }
            else if (typeDiscarded === 7 /* Trick */) {
                await room.drawCards(3, event.fromId, 'top', event.fromId, this.Name);
            }
        }
        return true;
    }
};
ZhanYi = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'zhanyi', description: 'zhanyi_description' })
], ZhanYi);
exports.ZhanYi = ZhanYi;
let ZhanYiShadow = class ZhanYiShadow extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 4 /* PlayCardStage */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    isAutoTrigger() {
        return true;
    }
    isFlaggedSkill(room, event, stage) {
        return stage !== "AfterAim" /* AfterAim */;
    }
    isTriggerable(event, stage) {
        return (stage === "BeforeCardUseEffect" /* BeforeCardUseEffect */ ||
            stage === "PreCardEffect" /* PreCardEffect */ ||
            stage === "AfterAim" /* AfterAim */ ||
            stage === "PhaseChanged" /* PhaseChanged */);
    }
    canUse(room, owner, event) {
        const identifier = event_packer_1.EventPacker.getIdentifier(event);
        if (identifier === 124 /* CardUseEvent */) {
            const cardUseEvent = event;
            return (cardUseEvent.fromId === owner.Id &&
                engine_1.Sanguosha.getCardById(cardUseEvent.cardId).is(0 /* Basic */) &&
                !owner.getFlag(this.Name) &&
                owner.getFlag(this.GeneralName) === 0 /* Basic */);
        }
        else if (identifier === 125 /* CardEffectEvent */) {
            const cardEffectEvent = event;
            return (cardEffectEvent.fromId === owner.Id &&
                engine_1.Sanguosha.getCardById(cardEffectEvent.cardId).is(7 /* Trick */) &&
                owner.getFlag(this.GeneralName) === 7 /* Trick */);
        }
        else if (identifier === 131 /* AimEvent */) {
            const aimEvent = event;
            return (aimEvent.fromId === owner.Id &&
                aim_group_1.AimGroupUtil.getAllTargets(aimEvent.allTargets).length === 1 &&
                engine_1.Sanguosha.getCardById(aimEvent.byCardId).GeneralName === 'slash' &&
                room.getPlayerById(aimEvent.toId).getPlayerCards().length > 0 &&
                owner.getFlag(this.GeneralName) === 1 /* Equip */);
        }
        else if (identifier === 104 /* PhaseChangeEvent */) {
            const phaseChangeEvent = event;
            return (phaseChangeEvent.from === 4 /* PlayCardStage */ &&
                phaseChangeEvent.fromPlayer === owner.Id &&
                owner.getFlag(this.GeneralName) !== undefined);
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const unknownEvent = event.triggeredOnEvent;
        const identifier = event_packer_1.EventPacker.getIdentifier(unknownEvent);
        if (identifier === 124 /* CardUseEvent */) {
            const cardUseEvent = unknownEvent;
            cardUseEvent.additionalDamage = (cardUseEvent.additionalDamage || 0) + 1;
            cardUseEvent.additionalRecoveredHp = (cardUseEvent.additionalRecoveredHp || 0) + 1;
            room.getPlayerById(event.fromId).setFlag(this.Name, true);
        }
        else if (identifier === 125 /* CardEffectEvent */) {
            const cardEffectEvent = unknownEvent;
            cardEffectEvent.disresponsiveCards = cardEffectEvent.disresponsiveCards || [];
            cardEffectEvent.disresponsiveCards.push(wuxiekeji_1.WuXieKeJi.name);
        }
        else if (identifier === 131 /* AimEvent */) {
            const toId = unknownEvent.toId;
            const response = await room.askForCardDrop(toId, 2, [0 /* HandArea */, 1 /* EquipArea */], true, undefined, this.GeneralName);
            if (response.droppedCards.length > 0) {
                await room.dropCards(4 /* SelfDrop */, response.droppedCards, toId, event.fromId, this.GeneralName);
                const toGain = response.droppedCards.filter(cardId => room.isCardInDropStack(cardId));
                if (toGain.length > 0) {
                    const resp = await room.doAskForCommonly(165 /* AskForChoosingCardEvent */, {
                        toId: event.fromId,
                        cardIds: toGain,
                        amount: 1,
                        customTitle: 'zhanyi: please choose one of these cards to gain',
                    }, event.fromId, true);
                    resp.selectedCards = resp.selectedCards || [toGain[0]];
                    await room.moveCards({
                        movingCards: [{ card: resp.selectedCards[0], fromArea: 4 /* DropStack */ }],
                        toId: event.fromId,
                        toArea: 0 /* HandArea */,
                        moveReason: 1 /* ActivePrey */,
                        proposer: event.fromId,
                        triggeredBySkills: [this.Name],
                    });
                }
            }
        }
        else {
            if (room.getFlag(event.fromId, this.GeneralName) === 0 /* Basic */) {
                room.uninstallSideEffectSkill(6 /* ZhanYi */);
            }
            room.removeFlag(event.fromId, this.GeneralName);
            room.getPlayerById(event.fromId).removeFlag(this.Name);
        }
        return true;
    }
};
ZhanYiShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: ZhanYi.Name, description: ZhanYi.Description })
], ZhanYiShadow);
exports.ZhanYiShadow = ZhanYiShadow;
let ZhanYiSide = class ZhanYiSide extends skill_1.ViewAsSkill {
    canViewAs() {
        return engine_1.Sanguosha.getCardNameByType(types => types.includes(0 /* Basic */));
    }
    canUse(room, owner, event) {
        const identifier = event && event_packer_1.EventPacker.getIdentifier(event);
        if (identifier === 160 /* AskForCardUseEvent */) {
            return (engine_1.Sanguosha.getCardNameByType(types => types.includes(0 /* Basic */)).find(name => owner.canUseCard(room, new card_matcher_1.CardMatcher({ name: [name] }), new card_matcher_1.CardMatcher(event.cardMatcher))) !== undefined);
        }
        return (identifier !== 159 /* AskForCardResponseEvent */ &&
            engine_1.Sanguosha.getCardNameByType(types => types.includes(0 /* Basic */)).find(name => owner.canUseCard(room, new card_matcher_1.CardMatcher({ name: [name] }))) !== undefined);
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    isAvailableCard(room, owner, pendingCardId) {
        return engine_1.Sanguosha.getCardById(pendingCardId).is(0 /* Basic */);
    }
    viewAs(selectedCards, owner, viewAs) {
        precondition_1.Precondition.assert(!!viewAs, 'Unknown zhanyi card');
        return card_1.VirtualCard.create({
            cardName: viewAs,
            bySkill: ZhanYi.Name,
        }, selectedCards);
    }
};
ZhanYiSide = tslib_1.__decorate([
    skill_wrappers_1.SideEffectSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: 'side_zhanyi_s', description: 'side_zhanyi_s_description' })
], ZhanYiSide);
exports.ZhanYiSide = ZhanYiSide;
