"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JianchuRemove = exports.JianChuShadow = exports.Jianchu = void 0;
const tslib_1 = require("tslib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let Jianchu = class Jianchu extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return (stage === "AfterAim" /* AfterAim */ &&
            event.byCardId !== undefined &&
            engine_1.Sanguosha.getCardById(event.byCardId).GeneralName === 'slash');
    }
    canUse(room, owner, event) {
        if (!event) {
            return false;
        }
        const { fromId, toId } = event;
        const target = room.getPlayerById(toId);
        return fromId === owner.Id && !target.Dead && target.getPlayerCards().length > 0;
    }
    async onTrigger(room, skillUseEvent) {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const { triggeredOnEvent } = skillUseEvent;
        const aimEvent = triggeredOnEvent;
        const to = room.getPlayerById(aimEvent.toId);
        const options = {
            [1 /* EquipArea */]: to.getCardIds(1 /* EquipArea */),
            [0 /* HandArea */]: to.getCardIds(0 /* HandArea */).length,
        };
        const chooseCardEvent = {
            fromId: aimEvent.fromId,
            toId: to.Id,
            options,
            triggeredBySkills: [this.Name],
        };
        const response = await room.askForChoosingPlayerCard(chooseCardEvent, skillUseEvent.fromId, true, true);
        if (!response) {
            return false;
        }
        await room.dropCards(5 /* PassiveDrop */, [response.selectedCard], chooseCardEvent.toId, chooseCardEvent.fromId, this.Name);
        if (!engine_1.Sanguosha.getCardById(response.selectedCard).is(0 /* Basic */)) {
            event_packer_1.EventPacker.setDisresponsiveEvent(aimEvent);
            const additionalTimes = room.getFlag(skillUseEvent.fromId, this.Name) || 0;
            room.setFlag(skillUseEvent.fromId, this.Name, additionalTimes + 1);
        }
        else if (aimEvent.byCardId && room.getCardOwnerId(aimEvent.byCardId) === undefined) {
            await room.moveCards({
                movingCards: [{ card: aimEvent.byCardId, fromArea: 6 /* ProcessingArea */ }],
                moveReason: 1 /* ActivePrey */,
                toArea: 0 /* HandArea */,
                toId: to.Id,
            });
        }
        return true;
    }
};
Jianchu = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'jianchu', description: 'jianchu_description' })
], Jianchu);
exports.Jianchu = Jianchu;
let JianChuShadow = class JianChuShadow extends skill_1.RulesBreakerSkill {
    breakCardUsableTimes(cardId, room, owner) {
        let match = false;
        if (cardId instanceof card_matcher_1.CardMatcher) {
            match = cardId.match(new card_matcher_1.CardMatcher({ generalName: ['slash'] }));
        }
        else {
            match = engine_1.Sanguosha.getCardById(cardId).GeneralName === 'slash';
        }
        const additionalTimes = room.getFlag(owner.Id, this.GeneralName);
        if (match && additionalTimes !== undefined && additionalTimes > 0) {
            return additionalTimes;
        }
        else {
            return 0;
        }
    }
};
JianChuShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_1.CommonSkill({ name: Jianchu.Name, description: Jianchu.Description })
], JianChuShadow);
exports.JianChuShadow = JianChuShadow;
let JianchuRemove = class JianchuRemove extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    isAutoTrigger() {
        return true;
    }
    isFlaggedSkill() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "PhaseChanged" /* PhaseChanged */ && event.from === 7 /* PhaseFinish */;
    }
    canUse(room, owner, content) {
        return content.fromPlayer === owner.Id && room.getFlag(owner.Id, this.GeneralName) !== undefined;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        room.removeFlag(skillUseEvent.fromId, this.GeneralName);
        return true;
    }
};
JianchuRemove = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_1.CommonSkill({ name: JianChuShadow.Name, description: JianChuShadow.Description })
], JianchuRemove);
exports.JianchuRemove = JianchuRemove;
