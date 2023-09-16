"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DuelSkill = void 0;
const tslib_1 = require("tslib");
const duel_1 = require("core/ai/skills/cards/duel");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const event_packer_1 = require("core/event/event_packer");
const precondition_1 = require("core/shares/libs/precondition/precondition");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let DuelSkill = class DuelSkill extends skill_1.ActiveSkill {
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
        return owner !== target && room.getPlayerById(owner).canUseCardTo(room, containerCard, target);
    }
    isAvailableTarget(owner, room, target, selectedCards, selectedTargets, containerCard) {
        return this.isCardAvailableTarget(owner, room, target, selectedCards, selectedTargets, containerCard);
    }
    async onUse(room, event) {
        return true;
    }
    async onEffect(room, event) {
        const targets = [
            precondition_1.Precondition.exists(event.toIds, 'Unknown targets in duel')[0],
            precondition_1.Precondition.exists(event.fromId, 'Unknown user in duel'),
        ];
        let turn = 0;
        let validResponse;
        while (true) {
            let responseCard;
            if (!event_packer_1.EventPacker.isDisresponsiveEvent(event)) {
                const response = await room.askForCardResponse({
                    toId: targets[turn],
                    cardMatcher: new card_matcher_1.CardMatcher({ generalName: ['slash'] }).toSocketPassenger(),
                    byCardId: event.cardId,
                    cardUserId: event.fromId,
                    conversation: translation_json_tool_1.TranslationPack.translationJsonPatcher('please response a {0} card to response {1}', 'slash', translation_json_tool_1.TranslationPack.patchCardInTranslation(event.cardId)).extract(),
                    triggeredBySkills: [this.Name],
                }, targets[turn]);
                responseCard = response.cardId;
            }
            if (responseCard !== undefined) {
                const responseEvent = {
                    fromId: targets[turn],
                    cardId: responseCard,
                    responseToEvent: event,
                };
                validResponse = await room.responseCard(responseEvent);
                if (validResponse) {
                    turn = (turn + 1) % targets.length;
                }
                else {
                    break;
                }
            }
            else {
                validResponse = false;
                break;
            }
        }
        const damageEvent = {
            fromId: targets[(turn + 1) % targets.length],
            cardIds: [event.cardId],
            damage: 1 + (event.additionalDamage ? event.additionalDamage : 0),
            damageType: "normal_property" /* Normal */,
            toId: targets[turn],
            triggeredBySkills: event.triggeredBySkills ? [...event.triggeredBySkills, this.Name] : [this.Name],
        };
        !validResponse && (await room.damage(damageEvent));
        return true;
    }
};
DuelSkill = tslib_1.__decorate([
    skill_1.AI(duel_1.DuelSkillTrigger),
    skill_1.CommonSkill({ name: 'duel', description: 'duel_description' })
], DuelSkill);
exports.DuelSkill = DuelSkill;
