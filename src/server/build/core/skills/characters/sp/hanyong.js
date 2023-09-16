"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HanYong = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
let HanYong = class HanYong extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "CardUsing" /* CardUsing */;
    }
    canUse(room, owner, content) {
        const card = engine_1.Sanguosha.getCardById(content.cardId);
        return (content.fromId === owner.Id &&
            owner.LostHp > 0 &&
            ((card.Name === 'slash' && card.Suit === 1 /* Spade */) ||
                card.GeneralName === 'nanmanruqin' ||
                card.GeneralName === 'wanjianqifa'));
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        const cardUseEvent = event.triggeredOnEvent;
        cardUseEvent.additionalDamage = cardUseEvent.additionalDamage ? cardUseEvent.additionalDamage++ : 1;
        if (room.getPlayerById(fromId).Hp > room.Circle) {
            room.addMark(fromId, "ran" /* Ran */, 1);
        }
        return true;
    }
};
HanYong = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'hanyong', description: 'hanyong_description' })
], HanYong);
exports.HanYong = HanYong;
