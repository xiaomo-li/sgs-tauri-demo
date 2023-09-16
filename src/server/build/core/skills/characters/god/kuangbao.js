"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KuangBao = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let KuangBao = class KuangBao extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return (stage === "AfterGameStarted" /* AfterGameStarted */ ||
            stage === "AfterDamageEffect" /* AfterDamageEffect */ ||
            stage === "AfterDamagedEffect" /* AfterDamagedEffect */);
    }
    triggerableTimes(event) {
        const identifier = event_packer_1.EventPacker.getIdentifier(event);
        if (identifier === 137 /* DamageEvent */) {
            return event.damage;
        }
        else {
            return 1;
        }
    }
    canUse(room, owner, event, stage) {
        const identifier = event_packer_1.EventPacker.getIdentifier(event);
        if (identifier === 137 /* DamageEvent */) {
            const damageEvent = event;
            if (stage === "AfterDamageEffect" /* AfterDamageEffect */) {
                return damageEvent.fromId === owner.Id;
            }
            else if (stage === "AfterDamagedEffect" /* AfterDamagedEffect */) {
                return damageEvent.toId === owner.Id;
            }
            return false;
        }
        else {
            return !owner.hasUsedSkill(this.Name);
        }
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillEffectEvent) {
        const unknownEvent = skillEffectEvent.triggeredOnEvent;
        const identifier = event_packer_1.EventPacker.getIdentifier(unknownEvent);
        if (identifier === 137 /* DamageEvent */) {
            room.addMark(skillEffectEvent.fromId, "nu" /* Wrath */, 1);
        }
        else {
            room.addMark(skillEffectEvent.fromId, "nu" /* Wrath */, 2);
        }
        return true;
    }
};
KuangBao = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'kuangbao', description: 'kuangbao_description' })
], KuangBao);
exports.KuangBao = KuangBao;
