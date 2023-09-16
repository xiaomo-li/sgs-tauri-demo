"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DuoDao = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
let DuoDao = class DuoDao extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterAim" /* AfterAim */;
    }
    canUse(room, owner, content) {
        const damageFrom = content.fromId !== undefined && room.getPlayerById(content.fromId);
        return (owner.Id !== content.fromId &&
            damageFrom &&
            !damageFrom.Dead &&
            damageFrom.getEquipment(2 /* Weapon */) !== undefined &&
            owner.getPlayerCards().length > 0 &&
            content.byCardId !== undefined &&
            engine_1.Sanguosha.getCardById(content.byCardId).GeneralName === 'slash' &&
            content.toId === owner.Id);
    }
    isAvailableCard(owner, room, cardId) {
        return room.canDropCard(owner, cardId);
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const { triggeredOnEvent } = skillUseEvent;
        const { fromId } = triggeredOnEvent;
        await room.dropCards(4 /* SelfDrop */, skillUseEvent.cardIds, skillUseEvent.fromId, skillUseEvent.fromId, this.Name);
        if (fromId !== undefined) {
            const weapon = room.getPlayerById(fromId).getEquipment(2 /* Weapon */);
            if (weapon === undefined) {
                return true;
            }
            await room.moveCards({
                movingCards: [{ card: weapon, fromArea: 1 /* EquipArea */ }],
                fromId,
                toId: skillUseEvent.fromId,
                toArea: 0 /* HandArea */,
                moveReason: 1 /* ActivePrey */,
                proposer: skillUseEvent.fromId,
                movedByReason: this.Name,
            });
        }
        return true;
    }
};
DuoDao = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'duodao', description: 'duodao_description' })
], DuoDao);
exports.DuoDao = DuoDao;
