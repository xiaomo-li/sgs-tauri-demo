"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YiJiShadow = exports.YiJi = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
let YiJi = class YiJi extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "AfterDamagedEffect" /* AfterDamagedEffect */;
    }
    canUse(room, owner, content) {
        return owner.Id === content.toId;
    }
    triggerableTimes(event) {
        return event.damage;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const { triggeredOnEvent } = skillUseEvent;
        const damagedEvent = triggeredOnEvent;
        await room.drawCards(2, damagedEvent.toId, 'top', damagedEvent.toId, this.Name);
        return true;
    }
};
YiJi = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'yiji', description: 'yiji_description' })
], YiJi);
exports.YiJi = YiJi;
let YiJiShadow = class YiJiShadow extends skill_1.TriggerSkill {
    isAutoTrigger() {
        return false;
    }
    isTriggerable(event, stage) {
        return stage === "AfterDrawCardEffect" /* AfterDrawCardEffect */ || stage === "AfterCardMoved" /* AfterCardMoved */;
    }
    getSkillLog(room, owner) {
        return 'please assign others no more than 2 handcards';
    }
    canUse(room, owner, content) {
        var _a, _b;
        const identifier = event_packer_1.EventPacker.getIdentifier(content);
        if (identifier === 127 /* DrawCardEvent */) {
            const drawCardEvent = content;
            return owner.Id === drawCardEvent.fromId && !!((_a = drawCardEvent.triggeredBySkills) === null || _a === void 0 ? void 0 : _a.includes(this.GeneralName));
        }
        else if (identifier === 128 /* MoveCardEvent */) {
            content = content;
            const info = content.infos[0];
            const from = info.fromId && room.getPlayerById(info.fromId);
            if (!from) {
                return false;
            }
            const usedTimes = from.getInvisibleMark(this.GeneralName);
            if (usedTimes >= 2) {
                from.removeInvisibleMark(this.GeneralName);
                return false;
            }
            return (owner.Id === info.fromId &&
                info.toArea === 0 /* HandArea */ &&
                !!((_b = content.triggeredBySkills) === null || _b === void 0 ? void 0 : _b.includes(this.GeneralName)) &&
                usedTimes < 2);
        }
        return false;
    }
    targetFilter(room, owner, targets) {
        return targets.length === 1;
    }
    cardFilter(room, owner, cards) {
        return cards.length > 0 && cards.length <= 2;
    }
    isAvailableCard(owner, room, cardId, selectedCards, selectedTargets, containerCard) {
        return true;
    }
    availableCardAreas() {
        return [0 /* HandArea */];
    }
    isAvailableTarget(owner, room, target, selectedCards, selectedTargets, containerCard) {
        return owner !== target;
    }
    async onTrigger(room, skillUseEvent) {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const { toIds, cardIds, fromId } = skillUseEvent;
        const from = room.getPlayerById(fromId);
        if (cardIds === undefined || cardIds.length === 0) {
            return true;
        }
        from.addInvisibleMark(this.GeneralName, cardIds.length);
        await room.moveCards({
            movingCards: cardIds.map(card => ({ card, fromArea: 0 /* HandArea */ })),
            fromId,
            toId: toIds[0],
            toArea: 0 /* HandArea */,
            moveReason: 2 /* ActiveMove */,
            proposer: fromId,
            movedByReason: this.GeneralName,
        });
        return true;
    }
};
YiJiShadow = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.CommonSkill({ name: YiJi.GeneralName, description: YiJi.Description })
], YiJiShadow);
exports.YiJiShadow = YiJiShadow;
