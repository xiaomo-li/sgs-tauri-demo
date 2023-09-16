"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DaoShuShadow = exports.DaoShu = void 0;
const tslib_1 = require("tslib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let DaoShu = class DaoShu extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return !owner.getFlag(this.Name);
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, target) {
        return target !== owner && room.getPlayerById(target).getCardIds(0 /* HandArea */).length > 0;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 0;
    }
    isAvailableCard() {
        return false;
    }
    async onUse() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, toIds } = event;
        if (!toIds) {
            return false;
        }
        const options = ['spade', 'club', 'diamond', 'heart'];
        const askForChooseEvent = event_packer_1.EventPacker.createUncancellableEvent({
            options,
            conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose a card suit', this.Name).extract(),
            toId: fromId,
            triggeredBySkills: [this.Name],
        });
        const resp = await room.doAskForCommonly(168 /* AskForChoosingOptionsEvent */, askForChooseEvent, fromId);
        resp.selectedOption = resp.selectedOption || options[3];
        let suit = 1 /* Spade */;
        switch (resp.selectedOption) {
            case options[1]:
                suit = 3 /* Club */;
                break;
            case options[2]:
                suit = 4 /* Diamond */;
                break;
            case options[3]:
                suit = 2 /* Heart */;
                break;
            default:
                break;
        }
        const toId = toIds[0];
        const target = room.getPlayerById(toId);
        const response = await room.doAskForCommonly(170 /* AskForChoosingCardFromPlayerEvent */, {
            fromId,
            toId,
            options: {
                [0 /* HandArea */]: target.getCardIds(0 /* HandArea */).length,
            },
            triggeredBySkills: [this.Name],
        }, fromId);
        if (response.selectedCardIndex !== undefined) {
            const cardIds = target.getCardIds(0 /* HandArea */);
            response.selectedCard = cardIds[Math.floor(Math.random() * cardIds.length)];
        }
        if (response.selectedCard !== undefined) {
            await room.moveCards({
                movingCards: [{ card: response.selectedCard, fromArea: response.fromArea }],
                fromId: toId,
                toId: fromId,
                toArea: 0 /* HandArea */,
                moveReason: 1 /* ActivePrey */,
                proposer: fromId,
                movedByReason: this.Name,
            });
            const cardSuit = engine_1.Sanguosha.getCardById(response.selectedCard).Suit;
            if (cardSuit === suit) {
                await room.damage({
                    fromId,
                    toId,
                    damage: 1,
                    damageType: "normal_property" /* Normal */,
                    triggeredBySkills: [this.Name],
                });
            }
            else {
                room.setFlag(fromId, this.Name, true);
                const from = room.getPlayerById(fromId);
                const hands = from.getCardIds(0 /* HandArea */);
                const restHands = hands.filter(card => engine_1.Sanguosha.getCardById(card).Suit !== cardSuit);
                if (restHands.length > 0) {
                    const allSuits = [1 /* Spade */, 3 /* Club */, 4 /* Diamond */, 2 /* Heart */];
                    const matcher = allSuits.filter(oneSuit => oneSuit !== cardSuit);
                    const response = await room.doAskForCommonly(163 /* AskForCardEvent */, event_packer_1.EventPacker.createUncancellableEvent({
                        cardAmount: 1,
                        toId: fromId,
                        reason: this.Name,
                        conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please give {1} a hand card except the card with suit {2}', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(target)).extract(),
                        fromArea: [0 /* HandArea */],
                        cardMatcher: new card_matcher_1.CardMatcher({ suit: [...matcher] }).toSocketPassenger(),
                        triggeredBySkills: [this.Name],
                    }), fromId);
                    response.selectedCards =
                        response.selectedCards.length > 0
                            ? response.selectedCards
                            : [restHands[Math.floor(Math.random() * restHands.length)]];
                    await room.moveCards({
                        movingCards: [{ card: response.selectedCards[0], fromArea: 0 /* HandArea */ }],
                        fromId,
                        toId,
                        toArea: 0 /* HandArea */,
                        moveReason: 2 /* ActiveMove */,
                        proposer: fromId,
                    });
                }
                else {
                    room.broadcast(126 /* CardDisplayEvent */, {
                        fromId,
                        displayCards: hands,
                        translationsMessage: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} display hand card {1}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(from), translation_json_tool_1.TranslationPack.patchCardInTranslation(...hands)).extract(),
                    });
                }
            }
        }
        return true;
    }
};
DaoShu = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'daoshu', description: 'daoshu_description' })
], DaoShu);
exports.DaoShu = DaoShu;
let DaoShuShadow = class DaoShuShadow extends skill_1.TriggerSkill {
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
    canUse(room, owner, content) {
        return content.from === 4 /* PlayCardStage */ && owner.getFlag(this.GeneralName);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        room.removeFlag(event.fromId, this.GeneralName);
        return true;
    }
};
DaoShuShadow = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.PersistentSkill(),
    skill_1.CommonSkill({ name: DaoShu.Name, description: DaoShu.Description })
], DaoShuShadow);
exports.DaoShuShadow = DaoShuShadow;
