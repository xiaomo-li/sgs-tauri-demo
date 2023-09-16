"use strict";
var FuJi_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FuJi = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
let FuJi = FuJi_1 = class FuJi extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "CardUsing" /* CardUsing */;
    }
    canUse(room, owner, content) {
        const card = engine_1.Sanguosha.getCardById(content.cardId);
        return (content.fromId === owner.Id &&
            !FuJi_1.FuJiUntriggerable.includes(card.GeneralName) &&
            !card.is(8 /* DelayedTrick */) &&
            !card.is(1 /* Equip */) &&
            room.getAlivePlayersFrom().find(target => room.distanceBetween(target, owner) === 1) !== undefined);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, triggeredOnEvent } = event;
        const from = room.getPlayerById(fromId);
        const cardUseEvent = triggeredOnEvent;
        const targets = room
            .getAlivePlayersFrom()
            .filter(target => room.distanceBetween(target, from) === 1)
            .map(player => player.Id);
        cardUseEvent.disresponsiveList = targets;
        return true;
    }
};
FuJi.FuJiUntriggerable = ['jink', 'peach', 'alcohol'];
FuJi = FuJi_1 = tslib_1.__decorate([
    skill_1.CompulsorySkill({ name: 'fuji', description: 'fuji_description' })
], FuJi);
exports.FuJi = FuJi;
