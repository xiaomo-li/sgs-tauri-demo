"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LieChi = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let LieChi = class LieChi extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "PlayerDying" /* PlayerDying */;
    }
    canUse(room, owner, content) {
        return (content.dying === owner.Id &&
            content.killedBy !== undefined &&
            !room.getPlayerById(content.killedBy).Dead &&
            room.getPlayerById(content.killedBy).getCardIds(0 /* HandArea */).length > 0);
    }
    async onTrigger(room, event) {
        event.animation = [
            {
                from: event.fromId,
                tos: [event.triggeredOnEvent.killedBy],
            },
        ];
        return true;
    }
    async onEffect(room, event) {
        const source = event.triggeredOnEvent.killedBy;
        const response = await room.askForCardDrop(source, 1, [0 /* HandArea */], true, undefined, this.Name);
        response.droppedCards.length > 0 &&
            (await room.dropCards(4 /* SelfDrop */, response.droppedCards, source, source, this.Name));
        return true;
    }
};
LieChi = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'liechi', description: 'liechi_description' })
], LieChi);
exports.LieChi = LieChi;
