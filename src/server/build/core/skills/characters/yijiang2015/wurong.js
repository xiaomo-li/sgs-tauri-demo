"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WuRong = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let WuRong = class WuRong extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return !owner.hasUsedSkill(this.Name) && owner.getCardIds(0 /* HandArea */).length > 0;
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
        const askForCardEvent = event_packer_1.EventPacker.createUncancellableEvent({
            cardAmount: 1,
            toId: '',
            reason: this.Name,
            conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose a hand card to display', this.Name).extract(),
            fromArea: [0 /* HandArea */],
            triggeredBySkills: [this.Name],
            ignoreNotifiedStatus: true,
        });
        const askingResponses = [];
        const askForPlayers = [fromId, toIds[0]];
        room.doNotify(askForPlayers);
        for (const playerId of askForPlayers) {
            askForCardEvent.toId = playerId;
            room.notify(163 /* AskForCardEvent */, askForCardEvent, playerId);
            askingResponses.push(room.onReceivingAsyncResponseFrom(163 /* AskForCardEvent */, playerId));
        }
        const responses = await Promise.all(askingResponses);
        const displayCards = [];
        for (const response of responses) {
            const handcards = room.getPlayerById(response.fromId).getCardIds(0 /* HandArea */);
            response.selectedCards = response.selectedCards || handcards[Math.floor(Math.random() * handcards.length)];
            const showCardEvent = {
                displayCards: [response.selectedCards[0]],
                fromId,
                translationsMessage: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} display hand card {1}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(response.fromId)), translation_json_tool_1.TranslationPack.patchCardInTranslation(response.selectedCards[0])).extract(),
            };
            room.broadcast(126 /* CardDisplayEvent */, showCardEvent);
            if (response.fromId === fromId) {
                displayCards.unshift(response.selectedCards[0]);
            }
            else {
                displayCards.push(response.selectedCards[0]);
            }
        }
        if (engine_1.Sanguosha.getCardById(displayCards[0]).GeneralName === 'slash' &&
            engine_1.Sanguosha.getCardById(displayCards[1]).GeneralName !== 'jink') {
            await room.damage({
                fromId,
                toId: toIds[0],
                damage: 1,
                damageType: "normal_property" /* Normal */,
                triggeredBySkills: [this.Name],
            });
        }
        else if (engine_1.Sanguosha.getCardById(displayCards[0]).GeneralName !== 'slash' &&
            engine_1.Sanguosha.getCardById(displayCards[1]).GeneralName === 'jink') {
            const to = room.getPlayerById(toIds[0]);
            const options = {
                [1 /* EquipArea */]: to.getCardIds(1 /* EquipArea */),
                [0 /* HandArea */]: to.getCardIds(0 /* HandArea */).length,
            };
            const chooseCardEvent = {
                fromId,
                toId: toIds[0],
                options,
                triggeredBySkills: [this.Name],
            };
            const resp = await room.askForChoosingPlayerCard(chooseCardEvent, fromId, false, true);
            if (!resp) {
                return false;
            }
            await room.moveCards({
                movingCards: [{ card: resp.selectedCard, fromArea: resp.fromArea }],
                fromId: chooseCardEvent.toId,
                toId: chooseCardEvent.fromId,
                toArea: 0 /* HandArea */,
                moveReason: 1 /* ActivePrey */,
                proposer: chooseCardEvent.fromId,
                movedByReason: this.Name,
            });
        }
        return true;
    }
};
WuRong = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'wurong', description: 'wurong_description' })
], WuRong);
exports.WuRong = WuRong;
