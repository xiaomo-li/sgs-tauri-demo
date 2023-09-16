"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeiMeng = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const algorithm_1 = require("core/shares/libs/algorithm");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let WeiMeng = class WeiMeng extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return !owner.hasUsedSkill(this.Name) && owner.Hp > 0;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 0;
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, target) {
        return target !== owner && room.getPlayerById(target).getCardIds(0 /* HandArea */).length > 0;
    }
    isAvailableCard() {
        return false;
    }
    async onUse(room, event) {
        return true;
    }
    async onEffect(room, event) {
        if (!event.toIds) {
            return false;
        }
        const handCards = room.getPlayerById(event.toIds[0]).getCardIds(0 /* HandArea */);
        const response = await room.doAskForCommonly(166 /* AskForChoosingCardWithConditionsEvent */, {
            toId: event.toIds[0],
            customCardFields: {
                [0 /* HandArea */]: handCards.length,
            },
            customTitle: this.Name,
            amount: [1, room.getPlayerById(event.fromId).Hp],
            triggeredBySkills: [this.Name],
        }, event.fromId, true);
        response.selectedCardsIndex = response.selectedCardsIndex || [0];
        response.selectedCards = algorithm_1.Algorithm.randomPick(response.selectedCardsIndex.length, handCards);
        const gainedNum = response.selectedCards.length;
        await room.moveCards({
            movingCards: response.selectedCards.map(card => ({ card, fromArea: 0 /* HandArea */ })),
            fromId: event.toIds[0],
            toId: event.fromId,
            toArea: 0 /* HandArea */,
            moveReason: 1 /* ActivePrey */,
            proposer: event.fromId,
            triggeredBySkills: [this.Name],
        });
        const numberGained = response.selectedCards.reduce((sum, cardId) => sum + engine_1.Sanguosha.getCardById(cardId).CardNumber, 0);
        if (room.getPlayerById(event.fromId).getPlayerCards().length > 0 && !room.getPlayerById(event.toIds[0]).Dead) {
            const amount = Math.min(room.getPlayerById(event.fromId).getPlayerCards().length, gainedNum);
            const resp = await room.doAskForCommonly(163 /* AskForCardEvent */, {
                cardAmount: amount,
                toId: event.fromId,
                reason: this.Name,
                conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: you need to give {1} card(s) to {2}', this.Name, amount, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(event.toIds[0]))).extract(),
                fromArea: [0 /* HandArea */, 1 /* EquipArea */],
                triggeredBySkills: [this.Name],
            }, event.fromId, true);
            resp.selectedCards =
                resp.selectedCards.length > 0
                    ? resp.selectedCards
                    : algorithm_1.Algorithm.randomPick(amount, room.getPlayerById(event.fromId).getPlayerCards());
            const numberGiven = resp.selectedCards.reduce((sum, cardId) => sum + engine_1.Sanguosha.getCardById(cardId).CardNumber, 0);
            await room.moveCards({
                movingCards: resp.selectedCards.map(card => ({
                    card,
                    fromArea: room.getPlayerById(event.fromId).cardFrom(card),
                })),
                fromId: event.fromId,
                toId: event.toIds[0],
                toArea: 0 /* HandArea */,
                moveReason: 2 /* ActiveMove */,
                proposer: event.fromId,
                triggeredBySkills: [this.Name],
            });
            if (numberGiven > numberGained) {
                await room.drawCards(1, event.fromId, 'top', event.fromId, this.Name);
            }
            else if (numberGiven < numberGained) {
                const to = room.getPlayerById(event.toIds[0]);
                const options = {
                    [1 /* EquipArea */]: to.getCardIds(1 /* EquipArea */),
                    [0 /* HandArea */]: to.getCardIds(0 /* HandArea */).length,
                    [2 /* JudgeArea */]: to.getCardIds(2 /* JudgeArea */),
                };
                const chooseCardEvent = {
                    fromId: event.fromId,
                    toId: event.toIds[0],
                    options,
                    triggeredBySkills: [this.Name],
                };
                const resp2 = await room.askForChoosingPlayerCard(chooseCardEvent, event.fromId, true, true);
                if (!resp2) {
                    return false;
                }
                await room.dropCards(5 /* PassiveDrop */, [resp2.selectedCard], event.toIds[0], event.fromId, this.Name);
            }
        }
        return true;
    }
};
WeiMeng = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'weimeng', description: 'weimeng_description' })
], WeiMeng);
exports.WeiMeng = WeiMeng;
