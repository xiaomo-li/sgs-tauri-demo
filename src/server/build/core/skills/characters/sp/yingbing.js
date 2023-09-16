"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YingBing = void 0;
const tslib_1 = require("tslib");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const zhoufu_1 = require("./zhoufu");
let YingBing = class YingBing extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "CardUsing" /* CardUsing */;
    }
    canUse(room, owner, event) {
        const zhou = room.getPlayerById(event.fromId).getCardIds(3 /* OutsideArea */, zhoufu_1.ZhouFu.Name);
        return (zhou.length > 0 &&
            engine_1.Sanguosha.getCardById(event.cardId).Color !== 2 /* None */ &&
            engine_1.Sanguosha.getCardById(event.cardId).Color === engine_1.Sanguosha.getCardById(zhou[0]).Color);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        await room.drawCards(1, event.fromId, 'top', event.fromId, this.Name);
        if (room.getFlag(event.fromId, this.Name)) {
            room.getPlayerById(event.fromId).removeFlag(this.Name);
            const fromId = event.triggeredOnEvent.fromId;
            const zhou = room.getPlayerById(fromId).getCardIds(3 /* OutsideArea */, zhoufu_1.ZhouFu.Name);
            if (zhou.length > 0) {
                await room.moveCards({
                    movingCards: zhou.map(card => ({ card, fromArea: 3 /* OutsideArea */ })),
                    fromId,
                    toId: event.fromId,
                    toArea: 0 /* HandArea */,
                    moveReason: 1 /* ActivePrey */,
                    proposer: event.fromId,
                    triggeredBySkills: [this.Name],
                });
            }
        }
        else {
            room
                .getPlayerById(event.fromId)
                .setFlag(this.Name, event.triggeredOnEvent.fromId);
        }
        return true;
    }
};
YingBing = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'yingbing', description: 'yingbing_description' })
], YingBing);
exports.YingBing = YingBing;
