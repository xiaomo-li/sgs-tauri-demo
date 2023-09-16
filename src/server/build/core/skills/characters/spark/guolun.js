"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuoLun = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let GuoLun = class GuoLun extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return !owner.hasUsedSkill(this.Name);
    }
    numberOfTargets() {
        return 1;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 0;
    }
    isAvailableTarget(owner, room, target) {
        return target !== owner && room.getPlayerById(target).getCardIds(0 /* HandArea */).length > 0;
    }
    isAvailableCard(owner, room, cardId) {
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
        const from = room.getPlayerById(fromId);
        const to = room.getPlayerById(toIds[0]);
        const options = {
            [0 /* HandArea */]: to.getCardIds(0 /* HandArea */).length,
        };
        const chooseCardEvent = event_packer_1.EventPacker.createUncancellableEvent({
            fromId,
            toId: toIds[0],
            options,
            triggeredBySkills: [this.Name],
        });
        const response = await room.doAskForCommonly(170 /* AskForChoosingCardFromPlayerEvent */, chooseCardEvent, fromId);
        if (response.selectedCardIndex !== undefined) {
            const cardIds = to.getCardIds(0 /* HandArea */);
            response.selectedCard = cardIds[Math.floor(Math.random() * cardIds.length)];
        }
        else if (response.selectedCard === undefined) {
            const cardIds = to.getCardIds(0 /* HandArea */);
            response.selectedCard = cardIds[Math.floor(Math.random() * cardIds.length)];
        }
        const showCardEvent = {
            displayCards: [response.selectedCard],
            fromId: toIds[0],
            translationsMessage: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} display hand card {1} from {2}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(from), translation_json_tool_1.TranslationPack.patchCardInTranslation(response.selectedCard), translation_json_tool_1.TranslationPack.patchPlayerInTranslation(to)).extract(),
        };
        room.broadcast(126 /* CardDisplayEvent */, showCardEvent);
        if (from.getPlayerCards().length > 0) {
            const resp = await room.doAskForCommonly(163 /* AskForCardEvent */, {
                cardAmount: 1,
                toId: fromId,
                reason: this.Name,
                conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: you can show a hand card and exchange this card for {1}', this.Name, translation_json_tool_1.TranslationPack.patchCardInTranslation(response.selectedCard)).extract(),
                fromArea: [0 /* HandArea */, 1 /* EquipArea */],
                triggeredBySkills: [this.Name],
            }, fromId);
            if (resp.selectedCards && resp.selectedCards.length > 0) {
                const diff = engine_1.Sanguosha.getCardById(response.selectedCard).CardNumber -
                    engine_1.Sanguosha.getCardById(resp.selectedCards[0]).CardNumber;
                const newShowCardEvent = {
                    displayCards: [resp.selectedCards[0]],
                    fromId,
                    translationsMessage: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} display hand card {1}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(from), translation_json_tool_1.TranslationPack.patchCardInTranslation(resp.selectedCards[0])).extract(),
                };
                room.broadcast(126 /* CardDisplayEvent */, newShowCardEvent);
                await room.moveCards({
                    moveReason: 3 /* PassiveMove */,
                    movingCards: [{ card: resp.selectedCards[0], fromArea: 0 /* HandArea */ }],
                    fromId,
                    toArea: 6 /* ProcessingArea */,
                    proposer: fromId,
                    movedByReason: this.Name,
                }, {
                    moveReason: 3 /* PassiveMove */,
                    movingCards: [{ card: response.selectedCard, fromArea: 0 /* HandArea */ }],
                    fromId: toIds[0],
                    toArea: 6 /* ProcessingArea */,
                    proposer: toIds[0],
                    movedByReason: this.Name,
                });
                await room.moveCards({
                    moveReason: 3 /* PassiveMove */,
                    movingCards: [{ card: resp.selectedCards[0], fromArea: 6 /* ProcessingArea */ }],
                    toId: toIds[0],
                    toArea: 0 /* HandArea */,
                    proposer: fromId,
                    movedByReason: this.Name,
                }, {
                    moveReason: 3 /* PassiveMove */,
                    movingCards: [{ card: response.selectedCard, fromArea: 6 /* ProcessingArea */ }],
                    toId: fromId,
                    toArea: 0 /* HandArea */,
                    proposer: toIds[0],
                    movedByReason: this.Name,
                });
                if (diff > 0) {
                    await room.drawCards(1, fromId, 'top', fromId, this.Name);
                }
                else if (diff < 0) {
                    await room.drawCards(1, toIds[0], 'top', toIds[0], this.Name);
                }
            }
        }
        return true;
    }
};
GuoLun = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'guolun', description: 'guolun_description' })
], GuoLun);
exports.GuoLun = GuoLun;
