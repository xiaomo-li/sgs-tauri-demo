"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XianShuai = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
let XianShuai = class XianShuai extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterDamageEffect" /* AfterDamageEffect */;
    }
    canUse(room, owner, content) {
        return (content.fromId !== undefined &&
            room.Analytics.getRecordEvents(event => event_packer_1.EventPacker.getIdentifier(event) === 137 /* DamageEvent */, undefined, 'circle', undefined, 2).length === 1);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const { fromId, triggeredOnEvent } = skillUseEvent;
        const damageEvent = triggeredOnEvent;
        await room.drawCards(1, fromId, 'top', fromId, this.Name);
        damageEvent.fromId === fromId &&
            (await room.damage({
                fromId,
                toId: damageEvent.toId,
                damage: 1,
                damageType: "normal_property" /* Normal */,
                triggeredBySkills: [this.Name],
            }));
        return true;
    }
};
XianShuai = tslib_1.__decorate([
    skill_1.CompulsorySkill({ name: 'xianshuai', description: 'xianshuai_description' })
], XianShuai);
exports.XianShuai = XianShuai;
