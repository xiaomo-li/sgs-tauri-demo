"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShaJue = void 0;
const tslib_1 = require("tslib");
const card_1 = require("core/cards/card");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let ShaJue = class ShaJue extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "PlayerDying" /* PlayerDying */;
    }
    canUse(room, owner, content) {
        return content.dying !== owner.Id && room.getPlayerById(content.dying).Hp < 0;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId } = event;
        room.addMark(fromId, "baoli" /* BaoLi */, 1);
        const cardIds = event.triggeredOnEvent.killedByCards;
        if (cardIds &&
            cardIds.length > 0 &&
            card_1.VirtualCard.getActualCards(cardIds).length > 0 &&
            room.isCardOnProcessing(cardIds[0])) {
            room.moveCards({
                movingCards: cardIds.map(card => ({ card, fromArea: 6 /* ProcessingArea */ })),
                toId: fromId,
                toArea: 0 /* HandArea */,
                moveReason: 1 /* ActivePrey */,
                proposer: fromId,
                triggeredBySkills: [this.Name],
            });
        }
        return true;
    }
};
ShaJue = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'shajue', description: 'shajue_description' })
], ShaJue);
exports.ShaJue = ShaJue;
