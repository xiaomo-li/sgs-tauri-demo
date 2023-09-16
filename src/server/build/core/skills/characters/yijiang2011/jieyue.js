"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JieYue = void 0;
const tslib_1 = require("tslib");
const jieyue_1 = require("core/ai/skills/characters/yijiang2011/jieyue");
const event_packer_1 = require("core/event/event_packer");
const algorithm_1 = require("core/shares/libs/algorithm");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let JieYue = class JieYue extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        return (owner.Id === content.playerId &&
            content.toStage === 19 /* FinishStageStart */ &&
            owner.getPlayerCards().length > 0);
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    isAvailableCard() {
        return true;
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, target) {
        return target !== owner;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const yujinId = skillUseEvent.fromId;
        const yujin = room.getPlayerById(yujinId);
        const toId = skillUseEvent.toIds[0];
        await room.moveCards({
            movingCards: skillUseEvent.cardIds.map(card => ({ card, fromArea: yujin.cardFrom(card) })),
            fromId: yujinId,
            toArea: 0 /* HandArea */,
            toId,
            moveReason: 2 /* ActiveMove */,
            proposer: yujinId,
            movedByReason: this.Name,
        });
        const to = room.getPlayerById(toId);
        if (to.getPlayerCards().length <= 0) {
            await room.drawCards(3, yujinId, undefined, toId, this.Name);
        }
        else {
            const askForChoice = event_packer_1.EventPacker.createUncancellableEvent({
                options: ['option-one', 'option-two'],
                askedBy: yujinId,
                toId,
                conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('jieyue: please choose jieyue options', this.Name, translation_json_tool_1.TranslationPack.patchPlayerInTranslation(yujin)).extract(),
                triggeredBySkills: [this.Name],
            });
            room.notify(168 /* AskForChoosingOptionsEvent */, askForChoice, toId);
            const response = await room.onReceivingAsyncResponseFrom(168 /* AskForChoosingOptionsEvent */, toId);
            if (response.selectedOption === 'option-one') {
                const customCardFields = {};
                const handCards = to.getCardIds(0 /* HandArea */);
                const equipCards = to.getCardIds(1 /* EquipArea */);
                if (handCards.length > 0) {
                    customCardFields[0 /* HandArea */] = handCards;
                }
                if (equipCards.length > 0) {
                    customCardFields[1 /* EquipArea */] = equipCards;
                }
                const askForDiscards = event_packer_1.EventPacker.createUncancellableEvent({
                    toId,
                    customCardFields,
                    cardFilter: 2 /* JieYue */,
                    involvedTargets: [toId],
                    customTitle: this.Name,
                    triggeredBySkills: [this.Name],
                });
                room.notify(166 /* AskForChoosingCardWithConditionsEvent */, askForDiscards, toId);
                const { selectedCards } = await room.onReceivingAsyncResponseFrom(166 /* AskForChoosingCardWithConditionsEvent */, toId);
                let discards;
                if (selectedCards === undefined) {
                    discards = [
                        algorithm_1.Algorithm.randomPick(handCards.length - 1, handCards)[0],
                        algorithm_1.Algorithm.randomPick(equipCards.length - 1, equipCards)[0],
                    ];
                }
                else {
                    discards = to.getPlayerCards().filter(card => !selectedCards.includes(card));
                }
                discards = discards.filter(id => room.canDropCard(toId, id));
                if (discards.length > 0) {
                    await room.dropCards(4 /* SelfDrop */, discards, toId, toId, this.Name);
                }
            }
            else {
                await room.drawCards(3, yujinId, undefined, toId, this.Name);
            }
        }
        return true;
    }
};
JieYue = tslib_1.__decorate([
    skill_wrappers_1.AI(jieyue_1.JieYueSkillTrigger),
    skill_wrappers_1.CommonSkill({ name: 'jieyue', description: 'jieyue_description' })
], JieYue);
exports.JieYue = JieYue;
