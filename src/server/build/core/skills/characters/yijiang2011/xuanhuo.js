"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XuanHuo = void 0;
const tslib_1 = require("tslib");
const card_1 = require("core/cards/card");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let XuanHuo = class XuanHuo extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        return (room.AlivePlayers.length > 2 &&
            owner.Id === content.playerId &&
            content.toStage === 12 /* DrawCardStageEnd */ &&
            owner.getCardIds(0 /* HandArea */).length >= 2);
    }
    numberOfTargets() {
        return 2;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 2;
    }
    isAvailableTarget(owner, room, target) {
        return owner !== target;
    }
    isAvailableCard() {
        return true;
    }
    availableCardAreas() {
        return [0 /* HandArea */];
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
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, toIds, cardIds } = event;
        const first = toIds[0];
        const second = toIds[1];
        await room.moveCards({
            movingCards: cardIds.map(card => ({ card, fromArea: 0 /* HandArea */ })),
            fromId,
            toId: first,
            toArea: 0 /* HandArea */,
            moveReason: 1 /* ActivePrey */,
            proposer: fromId,
            movedByReason: this.Name,
        });
        const options = [];
        const attackCards = engine_1.Sanguosha.getCardsByMatcher(new card_matcher_1.CardMatcher({ generalName: ['slash'] })).reduce((allName, card) => {
            allName.push(card.Name);
            return allName;
        }, []);
        attackCards.push('duel');
        const newOptions = [];
        for (const acard of attackCards) {
            if (room
                .getPlayerById(first)
                .canUseCardTo(room, acard !== 'duel' ? new card_matcher_1.CardMatcher({ name: [acard] }) : new card_matcher_1.CardMatcher({ generalName: [acard] }), second)) {
                if (!options.includes('xuanhuo:attack')) {
                    options.push('xuanhuo:attack');
                }
                newOptions.push(acard);
            }
        }
        if (room.getPlayerById(first).getCardIds(0 /* HandArea */).length > 0) {
            options.push('xuanhuo:give');
        }
        if (options.length === 0) {
            return false;
        }
        const askForChooseEvent = event_packer_1.EventPacker.createUncancellableEvent({
            options,
            conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose xuanhuo options: {1} {2}', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(second)), translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(fromId))).extract(),
            toId: first,
            triggeredBySkills: [this.Name],
        });
        const response = await room.doAskForCommonly(168 /* AskForChoosingOptionsEvent */, askForChooseEvent, first);
        response.selectedOption = response.selectedOption || askForChooseEvent.options[0];
        if (response.selectedOption === 'xuanhuo:attack') {
            if (newOptions.length === 0) {
                return false;
            }
            const askForChooseEvent = event_packer_1.EventPacker.createUncancellableEvent({
                options: newOptions,
                conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose xuanhuo attack options: {1}', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(second))).extract(),
                toId: first,
                triggeredBySkills: [this.Name],
            });
            const newResponse = await room.doAskForCommonly(168 /* AskForChoosingOptionsEvent */, askForChooseEvent, first);
            newResponse.selectedOption = newResponse.selectedOption || askForChooseEvent.options[0];
            const cardUseEvent = {
                fromId: first,
                targetGroup: [[second]],
                cardId: card_1.VirtualCard.create({ cardName: newResponse.selectedOption, bySkill: this.Name }).Id,
            };
            await room.useCard(cardUseEvent);
        }
        else {
            const handcards = room.getPlayerById(first).getCardIds(0 /* HandArea */);
            await room.moveCards({
                movingCards: handcards.map(card => ({ card, fromArea: 0 /* HandArea */ })),
                fromId: first,
                toId: fromId,
                toArea: 0 /* HandArea */,
                moveReason: 1 /* ActivePrey */,
                proposer: first,
                movedByReason: this.Name,
            });
        }
        return true;
    }
};
XuanHuo = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'xuanhuo', description: 'xuanhuo_description' })
], XuanHuo);
exports.XuanHuo = XuanHuo;
