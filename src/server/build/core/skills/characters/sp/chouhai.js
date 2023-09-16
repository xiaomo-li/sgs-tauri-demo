"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChouHai = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let ChouHai = class ChouHai extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "DamagedEffect" /* DamagedEffect */;
    }
    canUse(room, owner, content) {
        return (content.toId === owner.Id &&
            content.cardIds !== undefined &&
            owner.getCardIds(0 /* HandArea */).length === 0 &&
            engine_1.Sanguosha.getCardById(content.cardIds[0]).GeneralName === 'slash');
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
ChouHai = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'chouhai', description: 'chouhai_description' })
], ChouHai);
exports.ChouHai = ChouHai;
