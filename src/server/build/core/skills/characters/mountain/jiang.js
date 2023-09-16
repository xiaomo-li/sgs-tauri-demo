"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JiAng = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
let JiAng = class JiAng extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        if (!event.byCardId) {
            return false;
        }
        const card = engine_1.Sanguosha.getCardById(event.byCardId);
        return (stage === "AfterAimmed" /* AfterAimmed */ && ((card.GeneralName === 'slash' && card.isRed()) || card.GeneralName === 'duel'));
    }
    canUse(room, owner, event) {
        return event.fromId === owner.Id || event.toId === owner.Id;
    }
    async onTrigger(room, skillUseEvent) {
        return true;
    }
    async onEffect(room, event) {
        await room.drawCards(1, event.fromId, 'top', event.fromId, this.Name);
        return true;
    }
};
JiAng = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'jiang', description: 'jiang_description' })
], JiAng);
exports.JiAng = JiAng;
