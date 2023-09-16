"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RanShang = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let RanShang = class RanShang extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterDamagedEffect" /* AfterDamagedEffect */ || stage === "StageChanged" /* StageChanged */;
    }
    canUse(room, owner, content) {
        const identifier = event_packer_1.EventPacker.getIdentifier(content);
        if (identifier === 137 /* DamageEvent */) {
            const damageEvent = content;
            return damageEvent.toId === owner.Id && damageEvent.damageType === "fire_property" /* Fire */;
        }
        else if (identifier === 105 /* PhaseStageChangeEvent */) {
            const phaseStageChangeEvent = content;
            return (phaseStageChangeEvent.playerId === owner.Id &&
                phaseStageChangeEvent.toStage === 19 /* FinishStageStart */ &&
                owner.getMark("ran" /* Ran */) > 0);
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        const unknownEvent = event.triggeredOnEvent;
        const identifier = event_packer_1.EventPacker.getIdentifier(unknownEvent);
        if (identifier === 137 /* DamageEvent */) {
            const damage = unknownEvent.damage;
            room.addMark(fromId, "ran" /* Ran */, damage);
        }
        else {
            await room.loseHp(fromId, room.getPlayerById(fromId).getMark("ran" /* Ran */));
            if (room.getPlayerById(fromId).getMark("ran" /* Ran */) > 2) {
                await room.changeMaxHp(fromId, -2);
                await room.drawCards(2, fromId, 'top', fromId, this.Name);
            }
        }
        return true;
    }
};
RanShang = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'ranshang', description: 'ranshang_description' })
], RanShang);
exports.RanShang = RanShang;
