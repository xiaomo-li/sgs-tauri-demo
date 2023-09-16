"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PveClassicQiSha = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let PveClassicQiSha = class PveClassicQiSha extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "CardUsing" /* CardUsing */;
    }
    canUse(room, owner, content) {
        const card = engine_1.Sanguosha.getCardById(content.cardId);
        return (content.fromId === owner.Id &&
            ['slash', 'duel', 'fire_attack', 'nanmanruqing', 'wanjianqifa'].includes(card.GeneralName));
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const cardUseEvent = event.triggeredOnEvent;
        cardUseEvent.additionalDamage = cardUseEvent.additionalDamage ? cardUseEvent.additionalDamage++ : 1;
        return true;
    }
};
PveClassicQiSha = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'pve_classic_qisha', description: 'pve_classic_qisha_description' })
], PveClassicQiSha);
exports.PveClassicQiSha = PveClassicQiSha;
