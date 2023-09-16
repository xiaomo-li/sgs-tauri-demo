"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JianXiong = void 0;
const tslib_1 = require("tslib");
const card_1 = require("core/cards/card");
const skill_1 = require("core/skills/skill");
let JianXiong = class JianXiong extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterDamagedEffect" /* AfterDamagedEffect */;
    }
    canUse(room, owner, content) {
        return owner.Id === content.toId;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const { triggeredOnEvent } = skillUseEvent;
        const damagedEvent = triggeredOnEvent;
        if (damagedEvent.cardIds !== undefined &&
            card_1.VirtualCard.getActualCards(damagedEvent.cardIds).length > 0 &&
            room.isCardOnProcessing(damagedEvent.cardIds[0])) {
            const { cardIds, toId } = damagedEvent;
            await room.moveCards({
                movingCards: cardIds.map(card => ({ card, fromArea: 6 /* ProcessingArea */ })),
                toId,
                moveReason: 1 /* ActivePrey */,
                toArea: 0 /* HandArea */,
            });
        }
        await room.drawCards(1, damagedEvent.toId, undefined, damagedEvent.toId, this.Name);
        return true;
    }
};
JianXiong = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'jianxiong', description: 'jianxiong_description' })
], JianXiong);
exports.JianXiong = JianXiong;
