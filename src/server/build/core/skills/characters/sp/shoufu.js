"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShouFuDebuff = exports.ShouFuRemove = exports.ShouFuChoose = exports.ShouFu = void 0;
const tslib_1 = require("tslib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let ShouFu = class ShouFu extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return !owner.hasUsedSkill(this.Name);
    }
    cardFilter(room, owner, cards) {
        return cards.length === 0;
    }
    numberOfTargets() {
        return 0;
    }
    isAvailableTarget() {
        return false;
    }
    isAvailableCard() {
        return false;
    }
    async onUse() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        await room.drawCards(1, fromId, 'top', fromId, this.Name);
        const handcards = room.getPlayerById(fromId).getCardIds(0 /* HandArea */);
        const targets = room
            .getOtherPlayers(fromId)
            .filter(player => player.getCardIds(3 /* OutsideArea */, this.Name).length === 0)
            .map(player => player.Id);
        if (handcards.length > 0 && targets.length > 0) {
            room.notify(171 /* AskForSkillUseEvent */, event_packer_1.EventPacker.createUncancellableEvent({
                invokeSkillNames: [ShouFuChoose.Name],
                toId: fromId,
                conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose a hand card and choose a target who has no ‘Lu’?', this.Name).extract(),
                triggeredBySkills: [this.Name],
            }), fromId);
            const response = await room.onReceivingAsyncResponseFrom(171 /* AskForSkillUseEvent */, fromId);
            response.toIds = response.toIds || [targets[Math.floor(Math.random() * targets.length)]];
            response.cardIds = response.cardIds || [handcards[Math.floor(Math.random() * handcards.length)]];
            await room.moveCards({
                movingCards: [{ card: response.cardIds[0], fromArea: 0 /* HandArea */ }],
                fromId,
                toId: response.toIds[0],
                toArea: 3 /* OutsideArea */,
                moveReason: 2 /* ActiveMove */,
                toOutsideArea: this.Name,
                isOutsideAreaInPublic: true,
                proposer: fromId,
                movedByReason: this.Name,
            });
            const target = room.getPlayerById(response.toIds[0]);
            target.hasShadowSkill(ShouFuRemove.Name) || (await room.obtainSkill(response.toIds[0], ShouFuRemove.Name));
            target.hasShadowSkill(ShouFuDebuff.Name) || (await room.obtainSkill(response.toIds[0], ShouFuDebuff.Name));
        }
        return true;
    }
};
ShouFu = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'shoufu', description: 'shoufu_description' })
], ShouFu);
exports.ShouFu = ShouFu;
let ShouFuChoose = class ShouFuChoose extends skill_1.TriggerSkill {
    isTriggerable() {
        return false;
    }
    canUse() {
        return false;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    targetFilter(room, owner, targets) {
        return targets.length === 1;
    }
    isAvailableCard(owner, room, cardId) {
        return true;
    }
    isAvailableTarget(owner, room, targetId) {
        return (owner !== targetId &&
            room.getPlayerById(targetId).getCardIds(3 /* OutsideArea */, ShouFu.Name).length === 0);
    }
    availableCardAreas() {
        return [0 /* HandArea */];
    }
    async onTrigger() {
        return true;
    }
    async onEffect() {
        return true;
    }
};
ShouFuChoose = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.CommonSkill({ name: 'choose_shoufu', description: 'choose_shoufu_description' })
], ShouFuChoose);
exports.ShouFuChoose = ShouFuChoose;
let ShouFuRemove = class ShouFuRemove extends skill_1.TriggerSkill {
    isAutoTrigger() {
        return true;
    }
    isFlaggedSkill() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "AfterDamagedEffect" /* AfterDamagedEffect */ || stage === "AfterCardMoved" /* AfterCardMoved */;
    }
    canUse(room, owner, event) {
        const identifier = event_packer_1.EventPacker.getIdentifier(event);
        if (identifier === 137 /* DamageEvent */) {
            const damageEvent = event;
            return damageEvent.toId === owner.Id && owner.getCardIds(3 /* OutsideArea */, ShouFu.Name).length > 0;
        }
        else if (identifier === 128 /* MoveCardEvent */) {
            const moveCardEvent = event;
            const Lu = owner.getCardIds(3 /* OutsideArea */, ShouFu.Name);
            return (room.CurrentPhasePlayer === owner &&
                Lu.length > 0 &&
                moveCardEvent.infos.find(info => info.fromId === owner.Id &&
                    info.moveReason === 4 /* SelfDrop */ &&
                    info.movingCards.filter(card => engine_1.Sanguosha.getCardById(card.card).is(engine_1.Sanguosha.getCardById(Lu[0]).BaseType) &&
                        (card.fromArea === 0 /* HandArea */ || card.fromArea === 1 /* EquipArea */)).length > 1) !== undefined);
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        const from = room.getPlayerById(fromId);
        const Lu = from.getCardIds(3 /* OutsideArea */, ShouFu.Name);
        if (Lu.length === 0) {
            return false;
        }
        await room.moveCards({
            movingCards: Lu.map(card => ({ card, fromArea: 3 /* OutsideArea */ })),
            fromId,
            toArea: 4 /* DropStack */,
            moveReason: 6 /* PlaceToDropStack */,
            proposer: fromId,
            triggeredBySkills: [this.Name],
        });
        from.hasShadowSkill(this.Name) && (await room.loseSkill(fromId, this.Name));
        from.hasShadowSkill(ShouFuDebuff.Name) && (await room.loseSkill(fromId, ShouFuDebuff.Name));
        return true;
    }
};
ShouFuRemove = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.PersistentSkill(),
    skill_1.CommonSkill({ name: 'remove_shoufu', description: 'remove_shoufu_description' })
], ShouFuRemove);
exports.ShouFuRemove = ShouFuRemove;
let ShouFuDebuff = class ShouFuDebuff extends skill_1.FilterSkill {
    canUseCard(cardId, room, owner) {
        const Lu = room.getPlayerById(owner).getCardIds(3 /* OutsideArea */, ShouFu.Name);
        if (Lu.length === 0) {
            return true;
        }
        return cardId instanceof card_matcher_1.CardMatcher
            ? !cardId.match(new card_matcher_1.CardMatcher({ type: [engine_1.Sanguosha.getCardById(Lu[0]).BaseType] }))
            : !engine_1.Sanguosha.getCardById(cardId).is(engine_1.Sanguosha.getCardById(Lu[0]).BaseType);
    }
};
ShouFuDebuff = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.PersistentSkill(),
    skill_1.CommonSkill({ name: 'debuff_shoufu', description: 'debuff_shoufu_description' })
], ShouFuDebuff);
exports.ShouFuDebuff = ShouFuDebuff;
