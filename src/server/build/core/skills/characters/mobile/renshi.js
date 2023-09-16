"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RenShi = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let RenShi = class RenShi extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "DamagedEffect" /* DamagedEffect */;
    }
    canUse(room, owner, content) {
        return (content.toId === owner.Id &&
            owner.LostHp > 0 &&
            !!content.cardIds &&
            engine_1.Sanguosha.getCardById(content.cardIds[0]).GeneralName === 'slash');
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        event_packer_1.EventPacker.terminate(event.triggeredOnEvent);
        const damageCard = event.triggeredOnEvent.cardIds[0];
        room.isCardOnProcessing(damageCard) &&
            (await room.moveCards({
                movingCards: [{ card: damageCard, fromArea: 6 /* ProcessingArea */ }],
                toId: event.fromId,
                toArea: 0 /* HandArea */,
                moveReason: 1 /* ActivePrey */,
                triggeredBySkills: [this.Name],
            }));
        await room.changeMaxHp(event.fromId, -1);
        return true;
    }
};
RenShi = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'renshi', description: 'renshi_description' })
], RenShi);
exports.RenShi = RenShi;
