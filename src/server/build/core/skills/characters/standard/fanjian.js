"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FanJian = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const functional_1 = require("core/shares/libs/functional");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let FanJian = class FanJian extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return !owner.hasUsedSkill(this.Name);
    }
    isRefreshAt(room, owner, phase) {
        return phase === 4 /* PlayCardStage */;
    }
    numberOfTargets() {
        return 1;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    isAvailableTarget(owner, room, target) {
        return owner !== target;
    }
    isAvailableCard(owner, room, cardId) {
        return true;
    }
    availableCardAreas() {
        return [0 /* HandArea */];
    }
    async onUse(room, event) {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const toId = skillUseEvent.toIds[0];
        room.displayCards(skillUseEvent.fromId, skillUseEvent.cardIds);
        await room.moveCards({
            movingCards: [{ card: skillUseEvent.cardIds[0], fromArea: 0 /* HandArea */ }],
            fromId: skillUseEvent.fromId,
            toId,
            toArea: 0 /* HandArea */,
            moveReason: 2 /* ActiveMove */,
            proposer: skillUseEvent.fromId,
            engagedPlayerIds: room.getAllPlayersFrom().map(player => player.Id),
        });
        const moveCard = engine_1.Sanguosha.getCardById(skillUseEvent.cardIds[0]);
        const from = room.getPlayerById(skillUseEvent.fromId);
        const to = room.getPlayerById(toId);
        let selectedOption;
        if (to.getPlayerCards().length > 0) {
            const chooseOptionEvent = {
                toId,
                options: [
                    translation_json_tool_1.TranslationPack.translationJsonPatcher('drop all {0} cards', functional_1.Functional.getCardSuitRawText(moveCard.Suit)).toString(),
                    'lose a hp',
                ],
                conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} used skill {1} to you, please choose', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(from), this.Name).extract(),
                askedBy: skillUseEvent.fromId,
                triggeredBySkills: [this.Name],
            };
            room.notify(168 /* AskForChoosingOptionsEvent */, event_packer_1.EventPacker.createUncancellableEvent(chooseOptionEvent), toId);
            const response = await room.onReceivingAsyncResponseFrom(168 /* AskForChoosingOptionsEvent */, toId);
            selectedOption = response.selectedOption;
        }
        if (!selectedOption || selectedOption === 'lose a hp') {
            await room.loseHp(toId, 1);
        }
        else {
            const to = room.getPlayerById(toId);
            const handCards = to.getCardIds(0 /* HandArea */);
            const displayEvent = {
                fromId: toId,
                displayCards: handCards,
                translationsMessage: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} displayed cards {1}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(to), translation_json_tool_1.TranslationPack.patchCardInTranslation(...handCards)).extract(),
            };
            room.broadcast(126 /* CardDisplayEvent */, displayEvent);
            await room.dropCards(4 /* SelfDrop */, to.getPlayerCards().filter(card => engine_1.Sanguosha.getCardById(card).Suit === moveCard.Suit), toId);
        }
        return true;
    }
};
FanJian = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'fanjian', description: 'fanjian_description' })
], FanJian);
exports.FanJian = FanJian;
