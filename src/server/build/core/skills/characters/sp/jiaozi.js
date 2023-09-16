"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JiaoZi = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
let JiaoZi = class JiaoZi extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "DamageEffect" /* DamageEffect */ || stage === "DamagedEffect" /* DamagedEffect */;
    }
    canUse(room, owner, content, stage) {
        return (((stage === "DamageEffect" /* DamageEffect */ && content.fromId === owner.Id) ||
            (stage === "DamagedEffect" /* DamagedEffect */ && content.toId === owner.Id)) &&
            room
                .getOtherPlayers(owner.Id)
                .find(player => player.getCardIds(0 /* HandArea */).length >= owner.getCardIds(0 /* HandArea */).length) === undefined);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const damageEvent = event.triggeredOnEvent;
        damageEvent.damage++;
        return true;
    }
};
JiaoZi = tslib_1.__decorate([
    skill_1.CompulsorySkill({ name: 'jiaozi', description: 'jiaozi_description' })
], JiaoZi);
exports.JiaoZi = JiaoZi;
