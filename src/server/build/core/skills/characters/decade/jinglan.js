"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JingLan = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let JingLan = class JingLan extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterDamageEffect" /* AfterDamageEffect */;
    }
    canUse(room, owner, event) {
        return event.fromId === owner.Id;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const hp = room.getPlayerById(event.fromId).Hp;
        const handcardsNum = room.getPlayerById(event.fromId).getCardIds(0 /* HandArea */).length;
        if (handcardsNum > hp) {
            const response = await room.askForCardDrop(event.fromId, 3, [0 /* HandArea */], true, undefined, this.Name);
            response.droppedCards.length > 0 &&
                (await room.dropCards(4 /* SelfDrop */, response.droppedCards, event.fromId, event.fromId, this.Name));
        }
        else if (handcardsNum === hp) {
            const response = await room.askForCardDrop(event.fromId, 1, [0 /* HandArea */], true, undefined, this.Name);
            response.droppedCards.length > 0 &&
                (await room.dropCards(4 /* SelfDrop */, response.droppedCards, event.fromId, event.fromId, this.Name));
            await room.recover({
                toId: event.fromId,
                recoveredHp: 1,
                recoverBy: event.fromId,
            });
        }
        else {
            await room.damage({
                toId: event.fromId,
                damage: 1,
                damageType: "fire_property" /* Fire */,
                triggeredBySkills: [this.Name],
            });
            await room.drawCards(4, event.fromId, 'top', event.fromId, this.Name);
        }
        return true;
    }
};
JingLan = tslib_1.__decorate([
    skill_wrappers_1.CompulsorySkill({ name: 'jinglan', description: 'jinglan_description' })
], JingLan);
exports.JingLan = JingLan;
