"use strict";
var ShuangXiong_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShuangXiongRemove = exports.ShuangXiongShadow = exports.ShuangXiong = void 0;
const tslib_1 = require("tslib");
const card_1 = require("core/cards/card");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let ShuangXiong = ShuangXiong_1 = class ShuangXiong extends skill_1.ViewAsSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    canViewAs() {
        return ['duel'];
    }
    canUse(room, owner) {
        return (owner.canUseCard(room, new card_matcher_1.CardMatcher({ name: ['duel'] })) &&
            owner.getCardIds(0 /* HandArea */).length > 0 &&
            (room.getFlag(owner.Id, ShuangXiong_1.Red) !== undefined ||
                room.getFlag(owner.Id, ShuangXiong_1.Black) !== undefined));
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    isAvailableCard(room, owner, pendingCardId) {
        return ((room.getFlag(owner.Id, ShuangXiong_1.Red) === true && !engine_1.Sanguosha.getCardById(pendingCardId).isRed()) ||
            (room.getFlag(owner.Id, ShuangXiong_1.Black) === true && !engine_1.Sanguosha.getCardById(pendingCardId).isBlack()));
    }
    availableCardAreas() {
        return [0 /* HandArea */];
    }
    viewAs(selectedCards) {
        return card_1.VirtualCard.create({
            cardName: 'duel',
            bySkill: this.Name,
        }, selectedCards);
    }
};
ShuangXiong.Red = 'shuangxiong_red';
ShuangXiong.Black = 'shuangxiong_black';
ShuangXiong = ShuangXiong_1 = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'shuangxiong', description: 'shuangxiong_description' })
], ShuangXiong);
exports.ShuangXiong = ShuangXiong;
let ShuangXiongShadow = class ShuangXiongShadow extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        const unknownEvent = event_packer_1.EventPacker.getIdentifier(event);
        return ((unknownEvent === 127 /* DrawCardEvent */ && stage === "BeforeDrawCardEffect" /* BeforeDrawCardEffect */) ||
            (unknownEvent === 137 /* DamageEvent */ && stage === "AfterDamagedEffect" /* AfterDamagedEffect */));
    }
    findSlash(room, fromId) {
        return room.Analytics.getRecordEvents((event) => {
            if (event_packer_1.EventPacker.getIdentifier(event) !== 123 /* CardResponseEvent */) {
                return false;
            }
            if (event.fromId === fromId) {
                return false;
            }
            const { responseToEvent } = event;
            if (responseToEvent && event_packer_1.EventPacker.getIdentifier(responseToEvent) === 125 /* CardEffectEvent */) {
                const cardEffectEvent = responseToEvent;
                const card = engine_1.Sanguosha.getCardById(cardEffectEvent.cardId);
                if (card.GeneralName === 'duel' && card.isVirtualCard()) {
                    const shuangxiongCard = card;
                    const responseCard = engine_1.Sanguosha.getCardById(event.cardId);
                    const hasRealResponseCard = responseCard.isVirtualCard()
                        ? responseCard.ActualCardIds.length > 0
                        : true;
                    return hasRealResponseCard && shuangxiongCard.findByGeneratedSkill(this.GeneralName);
                }
            }
            return false;
        }).reduce((cards, event) => [
            ...cards,
            ...card_1.VirtualCard.getActualCards([event.cardId]).filter(cardId => room.isCardInDropStack(cardId) && !cards.includes(cardId)),
        ], []);
    }
    canUse(room, owner, event) {
        const unknownEvent = event_packer_1.EventPacker.getIdentifier(event);
        if (unknownEvent === 127 /* DrawCardEvent */) {
            const drawEvent = event;
            return (owner.Id === drawEvent.fromId &&
                room.CurrentPlayerPhase === 3 /* DrawCardStage */ &&
                drawEvent.drawAmount > 0 &&
                drawEvent.bySpecialReason === 0 /* GameStage */);
        }
        else if (unknownEvent === 137 /* DamageEvent */) {
            const damageEvent = event;
            if (damageEvent.cardIds &&
                damageEvent.cardIds.length === 1 &&
                engine_1.Sanguosha.getCardById(damageEvent.cardIds[0]).isVirtualCard()) {
                const damageCard = engine_1.Sanguosha.getCardById(damageEvent.cardIds[0]);
                return (owner.Id === damageEvent.toId &&
                    damageCard.findByGeneratedSkill(this.GeneralName) &&
                    damageEvent.fromId !== undefined &&
                    this.findSlash(room, owner.Id).length > 0);
            }
        }
        return false;
    }
    getSkillLog(room, owner, event) {
        const identifier = event_packer_1.EventPacker.getIdentifier(event);
        if (identifier === 127 /* DrawCardEvent */) {
            return super.getSkillLog(room, owner, event);
        }
        else {
            return 'shuangxiong: do you wanna to obtain slashes from "shuangxiong" ?';
        }
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const unknownEvent = event.triggeredOnEvent;
        const identifier = event_packer_1.EventPacker.getIdentifier(unknownEvent);
        if (identifier === 127 /* DrawCardEvent */) {
            const drawEvent = unknownEvent;
            const { fromId } = drawEvent;
            drawEvent.drawAmount = 0;
            const displayCards = room.getCards(2, 'top');
            const cardDisplayEvent = {
                displayCards,
                fromId,
                translationsMessage: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} used skill {1}, display cards: {2}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(fromId)), this.Name, translation_json_tool_1.TranslationPack.patchCardInTranslation(...displayCards)).extract(),
            };
            room.broadcast(126 /* CardDisplayEvent */, cardDisplayEvent);
            const chooseCardEvent = {
                toId: fromId,
                cardIds: displayCards,
                amount: 1,
                triggeredBySkills: [this.Name],
            };
            room.notify(165 /* AskForChoosingCardEvent */, event_packer_1.EventPacker.createUncancellableEvent(chooseCardEvent), fromId);
            const response = await room.onReceivingAsyncResponseFrom(165 /* AskForChoosingCardEvent */, fromId);
            if (response.selectedCards === undefined) {
                response.selectedCards = [displayCards[0]];
            }
            const chosenOne = response.selectedCards[0];
            await room.moveCards({
                movingCards: [{ card: chosenOne, fromArea: 6 /* ProcessingArea */ }],
                toId: fromId,
                toArea: 0 /* HandArea */,
                moveReason: 1 /* ActivePrey */,
                proposer: fromId,
                movedByReason: this.Name,
            });
            const chosenCard = engine_1.Sanguosha.getCardById(chosenOne);
            chosenCard.isRed() && room.setFlag(fromId, ShuangXiong.Red, true, ShuangXiong.Red);
            chosenCard.isBlack() && room.setFlag(fromId, ShuangXiong.Black, true, ShuangXiong.Red);
            await room.moveCards({
                movingCards: displayCards
                    .filter(id => id !== chosenOne)
                    .map(card => ({ card, fromArea: 6 /* ProcessingArea */ })),
                moveReason: 6 /* PlaceToDropStack */,
                toArea: 4 /* DropStack */,
                hideBroadcast: true,
                movedByReason: this.Name,
            });
        }
        else if (identifier === 137 /* DamageEvent */) {
            const damageEvent = unknownEvent;
            const { fromId, toId } = damageEvent;
            if (fromId) {
                const toObtain = this.findSlash(room, toId);
                await room.moveCards({
                    movingCards: toObtain.map(card => ({ card, fromArea: 4 /* DropStack */ })),
                    toId,
                    moveReason: 1 /* ActivePrey */,
                    toArea: 0 /* HandArea */,
                });
            }
        }
        return true;
    }
};
ShuangXiongShadow = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.CommonSkill({ name: ShuangXiong.GeneralName, description: ShuangXiong.Description })
], ShuangXiongShadow);
exports.ShuangXiongShadow = ShuangXiongShadow;
let ShuangXiongRemove = class ShuangXiongRemove extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    isAutoTrigger() {
        return true;
    }
    isFlaggedSkill(room, event, stage) {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "PhaseChanged" /* PhaseChanged */ && event.from === 7 /* PhaseFinish */;
    }
    canUse(room, owner, content) {
        return (content.fromPlayer === owner.Id &&
            (room.getFlag(owner.Id, ShuangXiong.Red) !== undefined ||
                room.getFlag(owner.Id, ShuangXiong.Black) !== undefined));
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        if (room.getFlag(skillUseEvent.fromId, ShuangXiong.Red) !== undefined) {
            room.removeFlag(skillUseEvent.fromId, ShuangXiong.Red);
        }
        if (room.getFlag(skillUseEvent.fromId, ShuangXiong.Black) !== undefined) {
            room.removeFlag(skillUseEvent.fromId, ShuangXiong.Black);
        }
        return true;
    }
};
ShuangXiongRemove = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.CommonSkill({ name: ShuangXiongShadow.Name, description: ShuangXiongShadow.Description })
], ShuangXiongRemove);
exports.ShuangXiongRemove = ShuangXiongRemove;
