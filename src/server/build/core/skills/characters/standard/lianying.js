"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LianYing = void 0;
const tslib_1 = require("tslib");
const skill_1 = require("core/skills/skill");
let LianYing = class LianYing extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterCardMoved" /* AfterCardMoved */;
    }
    canUse(room, owner, content) {
        const infos = content.infos.filter(info => owner.Id === info.fromId && info.movingCards.find(({ fromArea }) => fromArea === 0 /* HandArea */));
        const canUse = infos.length > 0 && owner.getCardIds(0 /* HandArea */).length === 0;
        if (canUse) {
            const num = infos.reduce((sum, info) => sum + info.movingCards.filter(card => card.fromArea === 0 /* HandArea */).length, 0);
            room.setFlag(owner.Id, this.Name, num);
        }
        return canUse;
    }
    targetFilter(room, owner, targets) {
        return targets.length > 0;
    }
    isAvailableTarget(owner, room, target, selectedCards, selectedTargets, containerCard) {
        const numberOfTargets = room.getFlag(owner, this.Name);
        return selectedTargets.length < numberOfTargets;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const { fromId, toIds } = skillUseEvent;
        for (const toId of toIds) {
            await room.drawCards(1, toId, 'top', fromId, this.Name);
        }
        return true;
    }
};
LianYing = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'lianying', description: 'lianying_description' })
], LianYing);
exports.LianYing = LianYing;
