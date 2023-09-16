"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShiBeiShadow = exports.ShiBei = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
let ShiBei = class ShiBei extends skill_1.TriggerSkill {
    async whenObtainingSkill(room, owner) {
        const records = room.Analytics.getDamagedRecord(owner.Id, 'round', undefined, 1);
        if (records.length > 0) {
            owner.setFlag(this.Name, true);
            event_packer_1.EventPacker.addMiddleware({ tag: this.Name, data: true }, records[0]);
        }
    }
    isTriggerable(event, stage) {
        return stage === "AfterDamageEffect" /* AfterDamageEffect */;
    }
    canUse(room, owner, event) {
        return event.toId === owner.Id;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const damagedEvent = event.triggeredOnEvent;
        if (event_packer_1.EventPacker.getMiddleware(this.Name, damagedEvent)) {
            await room.recover({ recoveredHp: 1, recoverBy: damagedEvent.toId, toId: damagedEvent.toId });
        }
        else {
            await room.loseHp(event.fromId, 1);
        }
        return true;
    }
};
ShiBei = tslib_1.__decorate([
    skill_1.CompulsorySkill({ name: 'shibei', description: 'shibei_description' })
], ShiBei);
exports.ShiBei = ShiBei;
let ShiBeiShadow = class ShiBeiShadow extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    isAutoTrigger() {
        return true;
    }
    isFlaggedSkill() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "DamageDone" /* DamageDone */ || stage === "PhaseChanged" /* PhaseChanged */;
    }
    canUse(room, owner, event) {
        const identifier = event_packer_1.EventPacker.getIdentifier(event);
        if (identifier === 137 /* DamageEvent */) {
            const damageEvent = event;
            return damageEvent.toId === owner.Id && !owner.getFlag(this.Name);
        }
        else if (identifier === 104 /* PhaseChangeEvent */) {
            const phaseChangeEvent = event;
            return phaseChangeEvent.from === 7 /* PhaseFinish */ && owner.getFlag(this.Name);
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const unknownEvent = event.triggeredOnEvent;
        const identifier = event_packer_1.EventPacker.getIdentifier(unknownEvent);
        if (identifier === 137 /* DamageEvent */) {
            room.getPlayerById(event.fromId).setFlag(this.Name, true);
            event_packer_1.EventPacker.addMiddleware({ tag: this.GeneralName, data: true }, unknownEvent);
        }
        else {
            room.removeFlag(event.fromId, this.Name);
        }
        return true;
    }
};
ShiBeiShadow = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.PersistentSkill(),
    skill_1.CompulsorySkill({ name: ShiBei.Name, description: ShiBei.Description })
], ShiBeiShadow);
exports.ShiBeiShadow = ShiBeiShadow;
