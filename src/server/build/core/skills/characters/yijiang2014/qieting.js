"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QieTing = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const algorithm_1 = require("core/shares/libs/algorithm");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let QieTing = class QieTing extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "BeforePhaseChange" /* BeforePhaseChange */ && event.from === 7 /* PhaseFinish */;
    }
    canUse(room, owner, content) {
        return (owner.Id !== content.fromPlayer &&
            room.Analytics.getRecordEvents(event => event_packer_1.EventPacker.getIdentifier(event) === 137 /* DamageEvent */ &&
                event.fromId === content.fromPlayer &&
                event.toId !== content.fromPlayer, content.fromPlayer, 'round', undefined, 1).length === 0);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, triggeredOnEvent } = event;
        const phaseStageChangeEvent = triggeredOnEvent;
        const toId = phaseStageChangeEvent.fromPlayer;
        const to = room.getPlayerById(toId);
        const canMoveCards = to.getCardIds(1 /* EquipArea */).filter(cardId => room.canPlaceCardTo(cardId, fromId));
        const options = ['qieting:draw'];
        if (canMoveCards.length > 0) {
            options.unshift('qieting:move');
        }
        if (to.getCardIds(0 /* HandArea */).length > 0) {
            options.unshift('qieting:prey');
        }
        if (options.length > 1) {
            const askForChooseEvent = event_packer_1.EventPacker.createUncancellableEvent({
                options,
                conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please choose qieting options: {1}', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(to)).extract(),
                toId: fromId,
            });
            const response = await room.doAskForCommonly(168 /* AskForChoosingOptionsEvent */, askForChooseEvent, fromId);
            response.selectedOption = response.selectedOption || askForChooseEvent.options[options.length - 1];
            if (response.selectedOption === 'qieting:prey') {
                const options = {
                    [0 /* HandArea */]: to.getCardIds(0 /* HandArea */),
                };
                if (to.getCardIds(0 /* HandArea */).length > 2) {
                    options[0 /* HandArea */] = algorithm_1.Algorithm.randomPick(2, to.getCardIds(0 /* HandArea */));
                }
                const chooseCardEvent = {
                    fromId,
                    toId,
                    options,
                    triggeredBySkills: [this.Name],
                };
                const response = await room.askForChoosingPlayerCard(chooseCardEvent, chooseCardEvent.fromId, false, true);
                if (!response) {
                    return false;
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
            }
            else if (response.selectedOption === 'qieting:move') {
                const askForChooseCardEvent = event_packer_1.EventPacker.createUncancellableEvent({
                    toId: fromId,
                    cardIds: canMoveCards,
                    amount: 1,
                    customTitle: 'qieting: please move one of these cards to you',
                });
                const response = await room.doAskForCommonly(165 /* AskForChoosingCardEvent */, askForChooseCardEvent, fromId);
                response.selectedCards = response.selectedCards || [
                    canMoveCards[Math.floor(Math.random() * canMoveCards.length)],
                ];
                await room.moveCards({
                    movingCards: [{ card: response.selectedCards[0], fromArea: 1 /* EquipArea */ }],
                    fromId: toId,
                    toId: fromId,
                    moveReason: 3 /* PassiveMove */,
                    toArea: 1 /* EquipArea */,
                    proposer: fromId,
                    movedByReason: this.Name,
                });
            }
            else {
                await room.drawCards(1, fromId, 'top', fromId, this.Name);
            }
        }
        else {
            await room.drawCards(1, fromId, 'top', fromId, this.Name);
        }
        return true;
    }
};
QieTing = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'qieting', description: 'qieting_description' })
], QieTing);
exports.QieTing = QieTing;
