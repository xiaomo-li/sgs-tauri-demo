"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WanJianQiFaSkill = void 0;
const tslib_1 = require("tslib");
const wanjianqifa_1 = require("core/ai/skills/cards/wanjianqifa");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const event_packer_1 = require("core/event/event_packer");
const precondition_1 = require("core/shares/libs/precondition/precondition");
const skill_1 = require("core/skills/skill");
const translation_json_tool_1 = require("core/translations/translation_json_tool");
let WanJianQiFaSkill = class WanJianQiFaSkill extends skill_1.ActiveSkill {
    canUse(room, owner, containerCard) {
        if (containerCard) {
            for (const target of room.getOtherPlayers(owner.Id)) {
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
    isCardAvailableTarget(owner, room, target) {
        return target !== owner;
    }
    isAvailableCard() {
        return false;
    }
    isAvailableTarget() {
        return false;
    }
    async onUse(room, event) {
        const others = room.getOtherPlayers(event.fromId);
        const from = room.getPlayerById(event.fromId);
        const groups = others.filter(player => from.canUseCardTo(room, event.cardId, player.Id)).map(player => [player.Id]);
        event.targetGroup = [...groups];
        return true;
    }
    async onEffect(room, event) {
        const { toIds, fromId, cardId } = event;
        const to = precondition_1.Precondition.exists(toIds, 'Unknown targets in wanjianqifa')[0];
        let responseCard;
        if (!event_packer_1.EventPacker.isDisresponsiveEvent(event)) {
            const askForCardEvent = {
                cardMatcher: new card_matcher_1.CardMatcher({
                    name: ['jink'],
                }).toSocketPassenger(),
                byCardId: cardId,
                cardUserId: fromId,
                conversation: fromId !== undefined
                    ? translation_json_tool_1.TranslationPack.translationJsonPatcher('{0} used {1} to you, please response a {2} card', translation_json_tool_1.TranslationPack.patchPlayerInTranslation(room.getPlayerById(fromId)), translation_json_tool_1.TranslationPack.patchCardInTranslation(cardId), 'jink').extract()
                    : translation_json_tool_1.TranslationPack.translationJsonPatcher('please response a {0} card', 'jink').extract(),
                triggeredBySkills: event.triggeredBySkills ? [...event.triggeredBySkills, this.Name] : [this.Name],
            };
            const response = await room.askForCardResponse(Object.assign(Object.assign({}, askForCardEvent), { toId: to, triggeredBySkills: [this.Name] }), to);
            responseCard = response.cardId;
        }
        if (responseCard === undefined) {
            const eventContent = {
                fromId,
                toId: to,
                damage: 1 + (event.additionalDamage ? event.additionalDamage : 0),
                damageType: "normal_property" /* Normal */,
                cardIds: [event.cardId],
                triggeredBySkills: event.triggeredBySkills ? [...event.triggeredBySkills, this.Name] : [this.Name],
            };
            await room.damage(eventContent);
        }
        else {
            const cardResponsedEvent = {
                fromId: to,
                cardId: responseCard,
                responseToEvent: event,
            };
            event_packer_1.EventPacker.terminate(event);
            await room.responseCard(cardResponsedEvent);
        }
        return true;
    }
};
WanJianQiFaSkill = tslib_1.__decorate([
    skill_1.AI(wanjianqifa_1.WanJianQiFaSkillTrigger),
    skill_1.CommonSkill({ name: 'wanjianqifa', description: 'wanjianqifa_description' })
], WanJianQiFaSkill);
exports.WanJianQiFaSkill = WanJianQiFaSkill;
