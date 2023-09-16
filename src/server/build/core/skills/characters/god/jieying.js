"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JieYingEffect = exports.JieYingDraw = exports.JieYing = void 0;
const tslib_1 = require("tslib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let JieYing = class JieYing extends skill_1.TriggerSkill {
    constructor() {
        super(...arguments);
        this.jieYingTarget = 'jieyingTarget';
    }
    async whenLosingSkill(room, player) {
        for (const other of room.getOtherPlayers(player.Id)) {
            if (other.getMark("ying" /* Ying */) === 0) {
                continue;
            }
            room.removeMark(other.Id, "ying" /* Ying */);
            await room.loseSkill(other.Id, JieYingEffect.Name);
        }
    }
    async whenDead(room, player) {
        for (const other of room.getOtherPlayers(player.Id)) {
            if (other.getMark("ying" /* Ying */) === 0) {
                continue;
            }
            room.removeMark(other.Id, "ying" /* Ying */);
            await room.loseSkill(other.Id, JieYingEffect.Name);
        }
    }
    isAutoTrigger(room, owner, event) {
        if ((event_packer_1.EventPacker.getIdentifier(event) === 104 /* PhaseChangeEvent */ &&
            event.to === 0 /* PhaseBegin */) ||
            (event_packer_1.EventPacker.getIdentifier(event) === 105 /* PhaseStageChangeEvent */ &&
                event.playerId !== owner.Id)) {
            return true;
        }
        return false;
    }
    isTriggerable(event, stage) {
        return (stage === "BeforePhaseChange" /* BeforePhaseChange */ ||
            (stage === "StageChanged" /* StageChanged */ &&
                event.toStage ===
                    23 /* PhaseFinish */));
    }
    canUse(room, owner, event) {
        const identifier = event_packer_1.EventPacker.getIdentifier(event);
        if (identifier === 104 /* PhaseChangeEvent */) {
            return (room.AlivePlayers.find(player => player.getMark("ying" /* Ying */) > 0) === undefined &&
                room.CurrentPlayer.Id === owner.Id);
        }
        else if (identifier === 105 /* PhaseStageChangeEvent */) {
            return (room
                .getPlayerById(event.playerId)
                .getMark("ying" /* Ying */) > 0);
        }
        return false;
    }
    isAvailableTarget(owner, room, target, selectedCards, selectedTargets, containerCard) {
        return !room.getPlayerById(target).getFlag(this.jieYingTarget);
    }
    targetFilter(room, owner, targets, selectedCards, cardId) {
        return targets.length === 1;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillEffectEvent) {
        const { triggeredOnEvent, fromId, toIds } = skillEffectEvent;
        const identifier = event_packer_1.EventPacker.getIdentifier(triggeredOnEvent);
        const from = room.getPlayerById(fromId);
        if (identifier === 104 /* PhaseChangeEvent */) {
            room.setMark(fromId, "ying" /* Ying */, 1);
            from.setFlag(this.jieYingTarget, true);
            await room.obtainSkill(fromId, JieYingEffect.Name);
        }
        else {
            if (from.getFlag(this.jieYingTarget)) {
                if (!toIds) {
                    return false;
                }
                const toId = toIds[0];
                from.removeFlag(this.jieYingTarget);
                room.removeMark(fromId, "ying" /* Ying */);
                room.setMark(toId, "ying" /* Ying */, 1);
                await room.loseSkill(fromId, JieYingEffect.Name);
                await room.obtainSkill(toId, JieYingEffect.Name);
            }
            else {
                const event = triggeredOnEvent;
                room.removeMark(event.playerId, "ying" /* Ying */);
                await room.moveCards({
                    fromId: event.playerId,
                    movingCards: room
                        .getPlayerById(event.playerId)
                        .getCardIds(0 /* HandArea */)
                        .map(card => ({ card, fromArea: 0 /* HandArea */ })),
                    moveReason: 3 /* PassiveMove */,
                    movedByReason: this.Name,
                    toArea: 0 /* HandArea */,
                    toId: fromId,
                    engagedPlayerIds: [fromId, event.playerId],
                });
            }
        }
        return true;
    }
};
JieYing = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'jieying', description: 'jieying_description' })
], JieYing);
exports.JieYing = JieYing;
let JieYingDraw = class JieYingDraw extends skill_1.TriggerSkill {
    isAutoTrigger() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "CardDrawing" /* CardDrawing */;
    }
    canUse(room, owner, content) {
        return (room.getPlayerById(content.fromId).getMark("ying" /* Ying */) > 0 &&
            room.CurrentPlayerPhase === 3 /* DrawCardStage */ &&
            content.bySpecialReason === 0 /* GameStage */);
    }
    async onTrigger(room, event) {
        event.translationsMessage = undefined;
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const { triggeredOnEvent } = skillUseEvent;
        const drawCardEvent = triggeredOnEvent;
        drawCardEvent.drawAmount += 1;
        return true;
    }
};
JieYingDraw = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.CommonSkill({ name: JieYing.Name, description: JieYing.Description })
], JieYingDraw);
exports.JieYingDraw = JieYingDraw;
let JieYingEffect = class JieYingEffect extends skill_1.RulesBreakerSkill {
    breakCardUsableTimes(cardId, room, owner) {
        if (room.getMark(owner.Id, "ying" /* Ying */) === 0) {
            return 0;
        }
        let match = false;
        if (cardId instanceof card_matcher_1.CardMatcher) {
            match = cardId.match(new card_matcher_1.CardMatcher({ generalName: ['slash'] }));
        }
        else {
            match = engine_1.Sanguosha.getCardById(cardId).GeneralName === 'slash';
        }
        if (match) {
            return 1;
        }
        else {
            return 0;
        }
    }
    breakAdditionalCardHoldNumber(room, owner) {
        if (room.getMark(owner.Id, "ying" /* Ying */) === 0) {
            return 0;
        }
        return 1;
    }
};
JieYingEffect = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.CommonSkill({ name: JieYingDraw.Name, description: JieYingDraw.Description })
], JieYingEffect);
exports.JieYingEffect = JieYingEffect;
