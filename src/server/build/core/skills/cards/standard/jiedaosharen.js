"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JieDaoShaRenSkill = void 0;
const tslib_1 = require("tslib");
const jiedaosharen_1 = require("core/ai/skills/cards/jiedaosharen");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const precondition_1 = require("core/shares/libs/precondition/precondition");
const target_group_1 = require("core/shares/libs/utils/target_group");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let JieDaoShaRenSkill = class JieDaoShaRenSkill extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return (room.getOtherPlayers(owner.Id).find(player => player.getEquipment(2 /* Weapon */) !== undefined) !== undefined);
    }
    numberOfTargets() {
        return 2;
    }
    cardFilter() {
        return true;
    }
    isAvailableCard() {
        return false;
    }
    isCardAvailableTarget(owner, room, target, selectedCards, selectedTargets, containerCard) {
        if (selectedTargets.length === 0) {
            return owner !== target && room.getPlayerById(target).getEquipment(2 /* Weapon */) !== undefined;
        }
        else {
            return room.canAttack(room.getPlayerById(selectedTargets[0]), room.getPlayerById(target));
        }
    }
    isAvailableTarget(owner, room, target, selectedCards, selectedTargets, containerCard) {
        return this.isCardAvailableTarget(owner, room, target, selectedCards, selectedTargets, containerCard);
    }
    getAnimationSteps(event) {
        const toIds = event.targetGroup[0];
        const { fromId } = event;
        return [
            { from: fromId, tos: [toIds[0]] },
            { from: toIds[0], tos: [toIds[1]] },
        ];
    }
    targetGroupDispatcher(targets) {
        return [targets];
    }
    async onUse(room, event) {
        const targets = target_group_1.TargetGroupUtil.getAllTargets(event.targetGroup)[0];
        event.translationsMessage = translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} used card {1} to {2} and announced {3} as pending target', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(event.fromId)), translation_json_tool_1.TranslationPack.patchCardInTranslation(event.cardId), translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(targets[0])), translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(targets[1]))).extract();
        event.animation = this.getAnimationSteps(event);
        return true;
    }
    async onEffect(room, event) {
        const { toIds, cardId } = event;
        if (toIds === undefined || toIds.length < 2) {
            // attacker or target maybe dead before effect
            return false;
        }
        const [attacker, target] = precondition_1.Precondition.exists(toIds, 'Unknown targets in jiedaosharen');
        const response = await room.askForCardUse({
            toId: attacker,
            byCardId: cardId,
            cardUserId: event.fromId,
            scopedTargets: [target],
            cardMatcher: new card_matcher_1.CardMatcher({ generalName: ['slash'] }).toSocketPassenger(),
            extraUse: true,
            commonUse: true,
            conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('please use a {0} to player {1} to response {2}', 'slash', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(target)), translation_json_tool_1.TranslationPack.patchCardInTranslation(cardId)).extract(),
            triggeredBySkills: [this.Name],
        }, attacker);
        if (response.cardId !== undefined) {
            const cardUseEvent = {
                fromId: response.fromId,
                cardId: response.cardId,
                targetGroup: response.toIds && [response.toIds],
                triggeredBySkills: event.triggeredBySkills ? [...event.triggeredBySkills, this.Name] : [this.Name],
            };
            await room.useCard(cardUseEvent, true);
        }
        else {
            const weapon = room.getPlayerById(attacker).getEquipment(2 /* Weapon */);
            if (weapon === undefined) {
                return true;
            }
            await room.moveCards({
                movingCards: [{ card: weapon, fromArea: 1 /* EquipArea */ }],
                fromId: attacker,
                toId: event.fromId,
                toArea: 0 /* HandArea */,
                moveReason: 1 /* ActivePrey */,
                proposer: event.fromId,
            });
        }
        return true;
    }
};
JieDaoShaRenSkill = tslib_1.__decorate([
    skill_1.AI(jiedaosharen_1.JieDaoShaRenSkillTrigger),
    skill_1.CommonSkill({ name: 'jiedaosharen', description: 'ljiedaosharen_description' })
], JieDaoShaRenSkill);
exports.JieDaoShaRenSkill = JieDaoShaRenSkill;
