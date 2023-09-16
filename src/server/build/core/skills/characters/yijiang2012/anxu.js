"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnXu = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let AnXu = class AnXu extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return !owner.hasUsedSkill(this.Name);
    }
    isRefreshAt(room, owner, phase) {
        return phase === 4 /* PlayCardStage */;
    }
    numberOfTargets() {
        return 2;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 0;
    }
    isAvailableTarget(owner, room, target, selectedCards, selectedTargets) {
        return (target !== owner &&
            (selectedTargets.length === 1 ? room.getPlayerById(target).getCardIds(0 /* HandArea */).length > 0 : true));
    }
    isAvailableCard() {
        return false;
    }
    async onUse() {
        return true;
    }
    getAnimationSteps(event) {
        const { fromId, toIds } = event;
        return [
            { from: fromId, tos: [toIds[0]] },
            { from: toIds[0], tos: [toIds[1]] },
        ];
    }
    resortTargets() {
        return false;
    }
    async onEffect(room, event) {
        const { fromId, toIds } = event;
        const first = toIds[0];
        const second = toIds[1];
        const secondPlayer = room.getPlayerById(second);
        const options = {
            [0 /* HandArea */]: secondPlayer.getCardIds(0 /* HandArea */).length,
            [1 /* EquipArea */]: secondPlayer.getCardIds(1 /* EquipArea */),
        };
        const chooseCardEvent = {
            fromId: first,
            toId: second,
            options,
            triggeredBySkills: [this.Name],
        };
        room.notify(170 /* AskForChoosingCardFromPlayerEvent */, event_packer_1.EventPacker.createUncancellableEvent(chooseCardEvent), first);
        const response = await room.onReceivingAsyncResponseFrom(170 /* AskForChoosingCardFromPlayerEvent */, first);
        if (response.selectedCard === undefined) {
            const cardIds = secondPlayer.getCardIds(0 /* HandArea */);
            response.selectedCard = cardIds[Math.floor(Math.random() * cardIds.length)];
        }
        await room.moveCards({
            movingCards: [{ card: response.selectedCard, fromArea: response.fromArea }],
            fromId: chooseCardEvent.toId,
            toId: chooseCardEvent.fromId,
            toArea: 0 /* HandArea */,
            moveReason: 1 /* ActivePrey */,
            proposer: chooseCardEvent.fromId,
            movedByReason: this.Name,
        });
        if (response.fromArea !== 1 /* EquipArea */) {
            await room.drawCards(1, fromId, 'top', fromId, this.Name);
        }
        const firstHandNum = room.getPlayerById(first).getCardIds(0 /* HandArea */).length;
        const secondHandNum = secondPlayer.getCardIds(0 /* HandArea */).length;
        let lessOne;
        if (firstHandNum > secondHandNum) {
            lessOne = second;
        }
        else if (firstHandNum < secondHandNum) {
            lessOne = first;
        }
        if (lessOne) {
            const askForInvokeSkill = {
                toId: fromId,
                options: ['yes', 'no'],
                conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: do you want to let {1} draw a card?', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(lessOne))).extract(),
                triggeredBySkills: [this.Name],
            };
            room.notify(168 /* AskForChoosingOptionsEvent */, askForInvokeSkill, fromId);
            const { selectedOption } = await room.onReceivingAsyncResponseFrom(168 /* AskForChoosingOptionsEvent */, fromId);
            if (selectedOption === 'yes') {
                await room.drawCards(1, lessOne, 'top', fromId, this.Name);
            }
        }
        return true;
    }
};
AnXu = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'anxu', description: 'anxu_description' })
], AnXu);
exports.AnXu = AnXu;
