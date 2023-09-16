"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QiMouBlocker = exports.QiMouShadow = exports.QiMou = void 0;
const tslib_1 = require("tslib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let QiMou = class QiMou extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return !owner.hasUsedSkill(this.Name);
    }
    numberOfTargets() {
        return 0;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 0;
    }
    isAvailableTarget(owner, room, target) {
        return false;
    }
    isAvailableCard(owner, room, cardId) {
        return false;
    }
    async onUse(room, event) {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const { fromId } = skillUseEvent;
        const from = room.getPlayerById(fromId);
        const options = [];
        for (let i = 0; i < from.Hp; i++) {
            options.push((i + 1).toString());
        }
        const askForLosingHpAmount = {
            toId: fromId,
            options,
            conversation: 'please choose the amount of hp to lose',
            triggeredBySkills: [this.Name],
        };
        room.notify(168 /* AskForChoosingOptionsEvent */, event_packer_1.EventPacker.createUncancellableEvent(askForLosingHpAmount), fromId);
        const response = await room.onReceivingAsyncResponseFrom(168 /* AskForChoosingOptionsEvent */, fromId);
        const lostHp = parseInt(response.selectedOption, 10);
        await room.loseHp(fromId, lostHp);
        await room.drawCards(lostHp, fromId, undefined, fromId, this.Name);
        room.setFlag(fromId, this.Name, lostHp, this.Name);
        return true;
    }
};
QiMou = tslib_1.__decorate([
    skill_1.LimitSkill({ name: 'qimou', description: 'qimou_description' })
], QiMou);
exports.QiMou = QiMou;
let QiMouShadow = class QiMouShadow extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    isAutoTrigger() {
        return true;
    }
    isFlaggedSkill(room, event, stage) {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "PhaseChanged" /* PhaseChanged */ && event.from === 7 /* PhaseFinish */;
    }
    canUse(room, owner, content) {
        return content.toPlayer === owner.Id && room.getFlag(owner.Id, this.GeneralName) !== undefined;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, content) {
        room.removeFlag(content.fromId, this.GeneralName);
        return true;
    }
};
QiMouShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.CommonSkill({ name: QiMou.Name, description: QiMou.Description })
], QiMouShadow);
exports.QiMouShadow = QiMouShadow;
let QiMouBlocker = class QiMouBlocker extends skill_1.RulesBreakerSkill {
    breakOffenseDistance(room, owner) {
        return room.getFlag(owner.Id, this.GeneralName) || 0;
    }
    breakCardUsableTimes(cardId, room, owner) {
        const additionalTimes = room.getFlag(owner.Id, this.GeneralName) || 0;
        if (cardId instanceof card_matcher_1.CardMatcher) {
            return cardId.match(new card_matcher_1.CardMatcher({ generalName: ['slash'] })) ? additionalTimes : 0;
        }
        else {
            return engine_1.Sanguosha.getCardById(cardId).GeneralName === 'slash' ? additionalTimes : 0;
        }
    }
};
QiMouBlocker = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.CommonSkill({ name: QiMouShadow.Name, description: QiMou.Description })
], QiMouBlocker);
exports.QiMouBlocker = QiMouBlocker;
