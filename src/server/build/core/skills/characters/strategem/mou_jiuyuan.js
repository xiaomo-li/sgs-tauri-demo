"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MouJiuYuan = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let MouJiuYuan = class MouJiuYuan extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "CardUsing" /* CardUsing */ || stage === "AfterAimmed" /* AfterAimmed */;
    }
    canUse(room, owner, event) {
        const identifier = event_packer_1.EventPacker.getIdentifier(event);
        if (identifier === 124 /* CardUseEvent */) {
            const cardUseEvent = event;
            return (cardUseEvent.fromId !== owner.Id &&
                room.getPlayerById(cardUseEvent.fromId).Nationality === 2 /* Wu */ &&
                engine_1.Sanguosha.getCardById(cardUseEvent.cardId).GeneralName === 'peach');
        }
        else if (identifier === 131 /* AimEvent */) {
            const aimEvent = event;
            return (aimEvent.fromId !== owner.Id &&
                room.getPlayerById(aimEvent.fromId).Nationality === 2 /* Wu */ &&
                engine_1.Sanguosha.getCardById(aimEvent.byCardId).GeneralName === 'peach');
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const unknownEvent = event.triggeredOnEvent;
        if (event_packer_1.EventPacker.getIdentifier(unknownEvent) === 124 /* CardUseEvent */) {
            await room.drawCards(1, event.fromId, 'top', event.fromId, this.Name);
        }
        else {
            const aimEvent = unknownEvent;
            aimEvent.additionalRecoveredHp = (aimEvent.additionalRecoveredHp || 0) + 1;
        }
        return true;
    }
};
MouJiuYuan = tslib_1.__decorate([
    skill_wrappers_1.LordSkill,
    skill_wrappers_1.CompulsorySkill({ name: 'mou_jiuyuan', description: 'mou_jiuyuan_description' })
], MouJiuYuan);
exports.MouJiuYuan = MouJiuYuan;
