"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FireAttackSkill = void 0;
const tslib_1 = require("tslib");
const fire_attack_1 = require("core/ai/skills/cards/fire_attack");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const functional_1 = require("core/shares/libs/functional");
const precondition_1 = require("core/shares/libs/precondition/precondition");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let FireAttackSkill = class FireAttackSkill extends skill_1.ActiveSkill {
    canUse() {
        return true;
    }
    numberOfTargets() {
        return 1;
    }
    cardFilter() {
        return true;
    }
    isAvailableCard() {
        return false;
    }
    isCardAvailableTarget(owner, room, target, selectedCards, selectedTargets, containerCard) {
        const to = room.getPlayerById(target);
        return (to.getCardIds(0 /* HandArea */).length > 0 &&
            room.getPlayerById(owner).canUseCardTo(room, containerCard, target));
    }
    isAvailableTarget(owner, room, target, selectedCards, selectedTargets, containerCard) {
        return this.isCardAvailableTarget(owner, room, target, selectedCards, selectedTargets, containerCard);
    }
    async onUse(room, event) {
        return true;
    }
    async onEffect(room, event) {
        const { toIds, fromId } = event;
        const toId = precondition_1.Precondition.exists(toIds, 'Unknown targets in fire_attack')[0];
        const to = room.getPlayerById(toId);
        if (to.getCardIds(0 /* HandArea */).length === 0) {
            return false;
        }
        const askForDisplayCardEvent = event_packer_1.EventPacker.createUncancellableEvent({
            cardAmount: 1,
            toId,
            triggeredBySkills: [this.Name],
            conversation: fromId !== undefined
                ? translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} used {1} to you, please present a hand card', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(fromId)), translation_json_tool_1.TranslationPack.patchCardInTranslation(event.cardId)).extract()
                : translation_json_tool_1.TranslationPack.translationJsonPatcher('{0}: please present a hand card', translation_json_tool_1.TranslationPack.patchCardInTranslation(event.cardId)).extract(),
        });
        room.notify(161 /* AskForCardDisplayEvent */, askForDisplayCardEvent, toId);
        const { selectedCards } = await room.onReceivingAsyncResponseFrom(161 /* AskForCardDisplayEvent */, toId);
        room.broadcast(126 /* CardDisplayEvent */, {
            fromId: toId,
            displayCards: selectedCards,
            translationsMessage: translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} display hand card {1}', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(to), translation_json_tool_1.TranslationPack.patchCardInTranslation(...selectedCards)).extract(),
        });
        if (fromId !== undefined) {
            const from = room.getPlayerById(fromId);
            if (!from.Dead && to.getCardIds(0 /* HandArea */).length > 0) {
                const card = engine_1.Sanguosha.getCardById(selectedCards[0]);
                const response = await room.askForCardDrop(fromId, 1, [0 /* HandArea */], false, from.getCardIds(0 /* HandArea */).filter(cardId => engine_1.Sanguosha.getCardById(cardId).Suit !== card.Suit), this.Name, translation_json_tool_1.TranslationPack.translationJsonPatcher('please drop a {0} hand card to hit {1} 1 hp of damage type fire', functional_1.Functional.getCardSuitRawText(card.Suit), translation_json_tool_1.TranslationPack.patchPlayerInTranslation(to)).extract());
                if (response.droppedCards.length > 0) {
                    await room.dropCards(4 /* SelfDrop */, response.droppedCards, fromId, fromId, this.Name);
                    const damageEvent = {
                        fromId,
                        toId,
                        damage: 1 + (event.additionalDamage ? event.additionalDamage : 0),
                        damageType: "fire_property" /* Fire */,
                        cardIds: [event.cardId],
                        triggeredBySkills: event.triggeredBySkills ? [...event.triggeredBySkills, this.Name] : [this.Name],
                    };
                    await room.damage(damageEvent);
                }
            }
        }
        return true;
    }
};
FireAttackSkill = tslib_1.__decorate([
    skill_1.AI(fire_attack_1.FireAttackSkillTrigger),
    skill_1.CommonSkill({ name: 'fire_attack', description: 'fire_attack_description' })
], FireAttackSkill);
exports.FireAttackSkill = FireAttackSkill;
