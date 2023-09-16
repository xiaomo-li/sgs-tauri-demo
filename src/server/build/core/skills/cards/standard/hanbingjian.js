"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HanBingJianSkill = void 0;
const tslib_1 = require("tslib");
const hanbingjian_1 = require("core/ai/skills/cards/hanbingjian");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
let HanBingJianSkill = class HanBingJianSkill extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "DamageEffect" /* DamageEffect */ && event.isFromChainedDamage !== true;
    }
    canUse(room, owner, event) {
        if (!event.cardIds || engine_1.Sanguosha.getCardById(event.cardIds[0]).GeneralName !== 'slash') {
            return false;
        }
        return event.fromId === owner.Id && room.getPlayerById(event.toId).getPlayerCards().length > 0;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { triggeredOnEvent } = event;
        const damageEvent = triggeredOnEvent;
        const to = room.getPlayerById(damageEvent.toId);
        event_packer_1.EventPacker.terminate(damageEvent);
        for (let i = 0; i < 2; i++) {
            if ((to.Id === event.fromId && to.getCardIds().filter(id => room.canDropCard(event.fromId, id)).length === 0) ||
                to.getPlayerCards().length === 0) {
                return false;
            }
            const options = {
                [0 /* HandArea */]: to.getCardIds(0 /* HandArea */).length,
                [1 /* EquipArea */]: to.getCardIds(1 /* EquipArea */),
            };
            const chooseCardEvent = {
                fromId: event.fromId,
                toId: to.Id,
                options,
                triggeredBySkills: [this.Name],
            };
            const response = await room.askForChoosingPlayerCard(chooseCardEvent, chooseCardEvent.fromId, true, true);
            if (!response) {
                return false;
            }
            await room.dropCards(5 /* PassiveDrop */, [response.selectedCard], chooseCardEvent.toId, chooseCardEvent.fromId, this.Name);
        }
        return true;
    }
};
HanBingJianSkill = tslib_1.__decorate([
    skill_1.AI(hanbingjian_1.HanBingJianSkillTrigger),
    skill_1.CommonSkill({ name: 'hanbingjian', description: 'hanbingjian_description' })
], HanBingJianSkill);
exports.HanBingJianSkill = HanBingJianSkill;
