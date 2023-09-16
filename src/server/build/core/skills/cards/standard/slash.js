"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlashSkill = void 0;
const tslib_1 = require("tslib");
const slash_1 = require("core/ai/skills/cards/slash");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
let SlashSkill = class SlashSkill extends skill_1.ActiveSkill {
    constructor() {
        super(...arguments);
        this.damageType = "normal_property" /* Normal */;
    }
    canUse(room, owner, contentOrContainerCard) {
        return (room
            .getOtherPlayers(owner.Id)
            .find(player => room.CommonRules.getCardUsableTimes(room, owner, engine_1.Sanguosha.getCardById(contentOrContainerCard), player) >
            owner.cardUsedTimes(new card_matcher_1.CardMatcher({ generalName: [this.Name] }))) !== undefined);
    }
    isRefreshAt() {
        return true;
    }
    isAvailableCard() {
        return false;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 0;
    }
    numberOfTargets() {
        return 1;
    }
    isCardAvailableTarget(owner, room, target) {
        return owner !== target;
    }
    isAvailableTarget(owner, room, target, selectedCards, selectedTargets, containerCard) {
        const except = [];
        if (containerCard) {
            const card = engine_1.Sanguosha.getCardById(containerCard);
            const ids = card.isVirtualCard() ? card.getRealActualCards() : [containerCard];
            except.push(...ids);
        }
        return room.canAttack(room.getPlayerById(owner), room.getPlayerById(target), containerCard, except.length > 0 ? except : undefined);
    }
    async onUse(room, event) {
        const player = room.getPlayerById(event.fromId);
        event_packer_1.EventPacker.addMiddleware({
            tag: "drunkLevel" /* DrunkTag */,
            data: player.hasDrunk(),
        }, event);
        room.clearHeaded(player.Id);
        return true;
    }
    async onEffect(room, event) {
        const { toIds, fromId, cardId } = event;
        const addtionalDrunkDamage = event_packer_1.EventPacker.getMiddleware("drunkLevel" /* DrunkTag */, event) || 0;
        const additionalDamage = event.additionalDamage || 0;
        const damageEvent = {
            fromId,
            toId: toIds[0],
            damage: 1 + addtionalDrunkDamage + additionalDamage,
            damageType: this.damageType,
            cardIds: [cardId],
            triggeredBySkills: event.triggeredBySkills ? [...event.triggeredBySkills, this.Name] : [this.Name],
        };
        event_packer_1.EventPacker.addMiddleware({
            tag: "drunkLevel" /* DrunkTag */,
            data: addtionalDrunkDamage,
        }, damageEvent);
        await room.damage(damageEvent);
        return true;
    }
};
SlashSkill = tslib_1.__decorate([
    skill_1.AI(slash_1.SlashSkillTrigger),
    skill_1.CommonSkill({ name: 'slash', description: 'slash_description' })
], SlashSkill);
exports.SlashSkill = SlashSkill;
