"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DuoJiShadow = exports.DuoJi = void 0;
const tslib_1 = require("tslib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let DuoJi = class DuoJi extends skill_1.ActiveSkill {
    async whenLosingSkill(room, owner) {
        for (const player of room.getAlivePlayersFrom()) {
            const ji = player.getCardIds(3 /* OutsideArea */, this.Name);
            if (ji.length > 0) {
                await room.moveCards({
                    movingCards: ji.map(card => ({ card, fromArea: 3 /* OutsideArea */ })),
                    fromId: player.Id,
                    toArea: 4 /* DropStack */,
                    moveReason: 6 /* PlaceToDropStack */,
                    proposer: player.Id,
                    triggeredBySkills: [this.Name],
                });
            }
        }
    }
    async whenDead(room, owner) {
        for (const player of room.getAlivePlayersFrom()) {
            const ji = player.getCardIds(3 /* OutsideArea */, this.Name);
            if (ji.length > 0) {
                await room.moveCards({
                    movingCards: ji.map(card => ({ card, fromArea: 3 /* OutsideArea */ })),
                    fromId: player.Id,
                    toArea: 4 /* DropStack */,
                    moveReason: 6 /* PlaceToDropStack */,
                    proposer: player.Id,
                    triggeredBySkills: [this.Name],
                });
            }
        }
    }
    canUse(room, owner) {
        return !owner.hasUsedSkill(this.Name) && owner.getPlayerCards().length > 0;
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, target) {
        return target !== owner;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    isAvailableCard() {
        return true;
    }
    async onUse() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, toIds, cardIds } = event;
        if (!toIds || !cardIds) {
            return false;
        }
        await room.moveCards({
            movingCards: [{ card: cardIds[0], fromArea: room.getPlayerById(fromId).cardFrom(cardIds[0]) }],
            fromId,
            toId: toIds[0],
            toArea: 3 /* OutsideArea */,
            moveReason: 2 /* ActiveMove */,
            toOutsideArea: this.Name,
            isOutsideAreaInPublic: true,
            proposer: fromId,
            movedByReason: this.Name,
        });
        return true;
    }
};
DuoJi = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'duoji', description: 'duoji_description' })
], DuoJi);
exports.DuoJi = DuoJi;
let DuoJiShadow = class DuoJiShadow extends skill_1.TriggerSkill {
    isAutoTrigger() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "CardUseFinishedEffect" /* CardUseFinishedEffect */ || stage === "BeforePhaseChange" /* BeforePhaseChange */;
    }
    canUse(room, owner, content) {
        const identifier = event_packer_1.EventPacker.getIdentifier(content);
        if (identifier === 124 /* CardUseEvent */) {
            const cardUseEvent = content;
            const from = room.getPlayerById(cardUseEvent.fromId);
            return (from.getCardIds(3 /* OutsideArea */, this.GeneralName).length > 0 &&
                engine_1.Sanguosha.getCardById(cardUseEvent.cardId).is(1 /* Equip */) &&
                from.getCardIds(1 /* EquipArea */).includes(cardUseEvent.cardId));
        }
        else if (identifier === 104 /* PhaseChangeEvent */) {
            const phaseChangeEvent = content;
            if (!phaseChangeEvent.fromPlayer) {
                return false;
            }
            return (room.getPlayerById(phaseChangeEvent.fromPlayer).getCardIds(3 /* OutsideArea */, this.GeneralName)
                .length > 0 && phaseChangeEvent.from === 7 /* PhaseFinish */);
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, triggeredOnEvent } = event;
        const unknownEvent = triggeredOnEvent;
        const identifier = event_packer_1.EventPacker.getIdentifier(unknownEvent);
        if (identifier === 124 /* CardUseEvent */) {
            const cardUseEvent = unknownEvent;
            const user = room.getPlayerById(cardUseEvent.fromId);
            const ji = user.getCardIds(3 /* OutsideArea */, this.GeneralName);
            const response = await room.doAskForCommonly(163 /* AskForCardEvent */, event_packer_1.EventPacker.createUncancellableEvent({
                cardAmount: 1,
                toId: cardUseEvent.fromId,
                reason: this.GeneralName,
                conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please remove a Ji', this.GeneralName).extract(),
                fromArea: [3 /* OutsideArea */],
                cardMatcher: new card_matcher_1.CardMatcher({
                    cards: ji,
                }).toSocketPassenger(),
                triggeredBySkills: [this.Name],
            }), cardUseEvent.fromId);
            if (response.selectedCards.length === 0) {
                response.selectedCards = [ji[0]];
            }
            if (user.getCardIds(1 /* EquipArea */).includes(cardUseEvent.cardId)) {
                await room.moveCards({
                    movingCards: [{ card: cardUseEvent.cardId, fromArea: 1 /* EquipArea */ }],
                    fromId: cardUseEvent.fromId,
                    toId: fromId,
                    toArea: 0 /* HandArea */,
                    moveReason: 1 /* ActivePrey */,
                    proposer: fromId,
                    triggeredBySkills: [this.GeneralName],
                });
                await room.moveCards({
                    movingCards: [{ card: response.selectedCards[0], fromArea: 3 /* OutsideArea */ }],
                    fromId: cardUseEvent.fromId,
                    toArea: 4 /* DropStack */,
                    moveReason: 6 /* PlaceToDropStack */,
                    proposer: cardUseEvent.fromId,
                    triggeredBySkills: [this.GeneralName],
                });
                await room.drawCards(1, fromId, 'top', fromId, this.GeneralName);
            }
        }
        else {
            const phaseChangeEvent = unknownEvent;
            if (!phaseChangeEvent.fromPlayer) {
                return false;
            }
            const ji = room
                .getPlayerById(phaseChangeEvent.fromPlayer)
                .getCardIds(3 /* OutsideArea */, this.GeneralName);
            await room.moveCards({
                movingCards: ji.map(card => ({ card, fromArea: 3 /* OutsideArea */ })),
                fromId: phaseChangeEvent.fromPlayer,
                toId: fromId,
                toArea: 0 /* HandArea */,
                moveReason: 1 /* ActivePrey */,
                proposer: fromId,
                triggeredBySkills: [this.GeneralName],
            });
        }
        return true;
    }
};
DuoJiShadow = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.CommonSkill({ name: DuoJi.Name, description: DuoJi.Description })
], DuoJiShadow);
exports.DuoJiShadow = DuoJiShadow;
