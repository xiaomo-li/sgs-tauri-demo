"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WuGuFengDengSkill = void 0;
const tslib_1 = require("tslib");
const wugufengdeng_1 = require("core/ai/skills/cards/wugufengdeng");
const event_packer_1 = require("core/event/event_packer");
const precondition_1 = require("core/shares/libs/precondition/precondition");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let WuGuFengDengSkill = class WuGuFengDengSkill extends skill_1.ActiveSkill {
    canUse(room, owner, containerCard) {
        if (containerCard) {
            for (const target of room.getAlivePlayersFrom()) {
                if (owner.canUseCardTo(room, containerCard, target.Id)) {
                    return true;
                }
            }
        }
        return false;
    }
    numberOfTargets() {
        return 0;
    }
    cardFilter() {
        return true;
    }
    isAvailableCard() {
        return false;
    }
    isAvailableTarget() {
        return false;
    }
    isCardAvailableTarget() {
        return true;
    }
    async onUse(room, event) {
        const all = room.getAlivePlayersFrom();
        const from = room.getPlayerById(event.fromId);
        const groups = all.filter(player => from.canUseCardTo(room, event.cardId, player.Id)).map(player => [player.Id]);
        event.targetGroup = [...groups];
        return true;
    }
    async beforeEffect(room, event) {
        var _a;
        const showCardNum = ((_a = event.allTargets) === null || _a === void 0 ? void 0 : _a.length) || 0;
        event.toCardIds = room.getCards(showCardNum, 'top');
        room.addProcessingCards(event.cardId.toString(), ...event.toCardIds);
        event_packer_1.EventPacker.addMiddleware({
            tag: event.cardId.toString(),
            data: [],
        }, event);
        const wugufengdengEvent = {
            cardIds: event.toCardIds,
            selected: [],
        };
        room.broadcast(129 /* ObserveCardsEvent */, wugufengdengEvent);
        return true;
    }
    async onEffect(room, event) {
        const toId = precondition_1.Precondition.exists(event.toIds, 'Unknown targets of wugufengdeng')[0];
        const selectedCards = precondition_1.Precondition.exists(event_packer_1.EventPacker.getMiddleware(event.cardId.toString(), event), 'Unable to get wugufengdeng cards');
        const wugufengdengEvent = {
            cardIds: event.toCardIds,
            selected: selectedCards,
            toId,
            userId: event.fromId,
            triggeredBySkills: [this.Name],
        };
        room.notify(173 /* AskForContinuouslyChoosingCardEvent */, wugufengdengEvent, toId);
        const response = await room.onReceivingAsyncResponseFrom(173 /* AskForContinuouslyChoosingCardEvent */, toId);
        selectedCards.push({
            card: response.selectedCard,
            player: toId,
        });
        room.broadcast(129 /* ObserveCardsEvent */, wugufengdengEvent);
        room.endProcessOnCard(response.selectedCard);
        await room.moveCards({
            movingCards: [{ card: response.selectedCard, fromArea: 6 /* ProcessingArea */ }],
            toId,
            toArea: 0 /* HandArea */,
            moveReason: 1 /* ActivePrey */,
        });
        return true;
    }
    async afterEffect(room, event) {
        const wugufengdengCards = room.getProcessingCards(event.cardId.toString());
        const droppedCards = [];
        for (const cardId of event.toCardIds) {
            if (wugufengdengCards.includes(cardId)) {
                droppedCards.push(cardId);
            }
        }
        await room.moveCards({
            movingCards: droppedCards.map(card => ({ card, fromArea: 6 /* ProcessingArea */ })),
            toArea: 4 /* DropStack */,
            moveReason: 6 /* PlaceToDropStack */,
        });
        room.broadcast(130 /* ObserveCardFinishEvent */, {
            translationsMessage: droppedCards.length > 0
                ? translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} has been placed into drop stack', translation_json_tool_1.TranslationPack.patchCardInTranslation(...droppedCards)).extract()
                : undefined,
        });
        return true;
    }
};
WuGuFengDengSkill = tslib_1.__decorate([
    skill_1.AI(wugufengdeng_1.WuGuFengDengSkillTrigger),
    skill_1.CommonSkill({ name: 'wugufengdeng', description: 'wugufengdeng_description' })
], WuGuFengDengSkill);
exports.WuGuFengDengSkill = WuGuFengDengSkill;
