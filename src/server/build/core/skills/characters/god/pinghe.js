"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PingHeSelect = exports.PingHeShadow = exports.PingHe = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let PingHe = class PingHe extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "DamagedEffect" /* DamagedEffect */;
    }
    canUse(room, owner, content) {
        return (!!content.fromId &&
            content.fromId !== owner.Id &&
            content.toId === owner.Id &&
            owner.getCardIds(0 /* HandArea */).length > 0 &&
            owner.MaxHp > 1);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        const damageEvent = event.triggeredOnEvent;
        event_packer_1.EventPacker.terminate(damageEvent);
        await room.changeMaxHp(fromId, -1);
        const hands = room.getPlayerById(fromId).getCardIds(0 /* HandArea */);
        if (hands.length > 0) {
            const response = await room.doAskForCommonly(171 /* AskForSkillUseEvent */, {
                invokeSkillNames: [PingHeSelect.Name],
                toId: fromId,
                conversation: 'pinghe: please give a handcard to another player',
            }, fromId, true);
            const others = room.getOtherPlayers(fromId);
            const cardIds = response.cardIds || [hands[Math.floor(Math.random() * hands.length)]];
            const toIds = response.toIds || [others[Math.floor(Math.random() * others.length)].Id];
            await room.moveCards({
                movingCards: cardIds.map(card => ({ card, fromArea: 0 /* HandArea */ })),
                fromId,
                toId: toIds[0],
                toArea: 0 /* HandArea */,
                moveReason: 2 /* ActiveMove */,
                proposer: fromId,
            });
        }
        if (damageEvent.fromId && !room.getPlayerById(damageEvent.fromId).Dead) {
            room.addMark(damageEvent.fromId, "pingding" /* PingDing */, 1);
        }
        return true;
    }
};
PingHe = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'pinghe', description: 'pinghe_description' })
], PingHe);
exports.PingHe = PingHe;
let PingHeShadow = class PingHeShadow extends skill_1.RulesBreakerSkill {
    breakBaseCardHoldNumber(room, owner) {
        return owner.LostHp;
    }
};
PingHeShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.CompulsorySkill({ name: PingHe.GeneralName, description: PingHe.Description })
], PingHeShadow);
exports.PingHeShadow = PingHeShadow;
let PingHeSelect = class PingHeSelect extends skill_1.TriggerSkill {
    isTriggerable() {
        return false;
    }
    canUse() {
        return false;
    }
    numberOfTargets() {
        return 1;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    isAvailableTarget(owner, room, target) {
        return target !== owner;
    }
    isAvailableCard() {
        return true;
    }
    availableCardAreas() {
        return [0 /* HandArea */];
    }
    async onTrigger() {
        return true;
    }
    async onEffect() {
        return true;
    }
};
PingHeSelect = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.CommonSkill({ name: 'shadow_pinghe', description: 'shadow_pinghe_description' })
], PingHeSelect);
exports.PingHeSelect = PingHeSelect;
