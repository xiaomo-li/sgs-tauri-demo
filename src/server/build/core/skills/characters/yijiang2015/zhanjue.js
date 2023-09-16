"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZhanJueShadow = exports.ZhanJue = void 0;
const tslib_1 = require("tslib");
const card_1 = require("core/cards/card");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
let ZhanJue = class ZhanJue extends skill_1.ViewAsSkill {
    canViewAs(room, owner, selectedCards, cardMatcher) {
        return cardMatcher ? [] : ['duel'];
    }
    canUse(room, owner) {
        return ((owner.getFlag(this.Name) || 0) < 2 &&
            owner.getCardIds(0 /* HandArea */).length > 0 &&
            owner.canUseCard(room, new card_matcher_1.CardMatcher({ name: ['duel'] })));
    }
    cardFilter(room, owner, cards) {
        return cards.length === 0;
    }
    isAvailableCard(room, owner, pendingCardId) {
        return false;
    }
    viewAs(selectedCards, owner) {
        return card_1.VirtualCard.create({
            cardName: 'duel',
            bySkill: this.Name,
        }, owner.getCardIds(0 /* HandArea */));
    }
};
ZhanJue = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'zhanjue', description: 'zhanjue_description' })
], ZhanJue);
exports.ZhanJue = ZhanJue;
let ZhanJueShadow = class ZhanJueShadow extends skill_1.TriggerSkill {
    constructor() {
        super(...arguments);
        this.ZhanJueStage = 'zhanjue_stage';
    }
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 0 /* PhaseBegin */ && stage === "AfterPhaseChanged" /* AfterPhaseChanged */;
    }
    afterDead(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 0 /* PhaseBegin */ && stage === "AfterPhaseChanged" /* AfterPhaseChanged */;
    }
    isAutoTrigger() {
        return true;
    }
    isFlaggedSkill() {
        return true;
    }
    isTriggerable(event, stage) {
        return (stage === "BeforeCardUseEffect" /* BeforeCardUseEffect */ ||
            stage === "CardUseFinishedEffect" /* CardUseFinishedEffect */ ||
            stage === "StageChanged" /* StageChanged */);
    }
    canUse(room, owner, event, stage) {
        const identifier = event_packer_1.EventPacker.getIdentifier(event);
        if (identifier === 124 /* CardUseEvent */) {
            const cardUseEvent = event;
            const card = engine_1.Sanguosha.getCardById(cardUseEvent.cardId);
            if (!(card.GeneralName === 'duel' &&
                card.isVirtualCard() &&
                card.findByGeneratedSkill(this.GeneralName)) ||
                (stage === "BeforeCardUseEffect" /* BeforeCardUseEffect */ && cardUseEvent.fromId !== owner.Id) ||
                (stage === "CardUseFinishedEffect" /* CardUseFinishedEffect */ &&
                    (event_packer_1.EventPacker.getMiddleware(this.Name, cardUseEvent) || cardUseEvent.fromId) !== owner.Id)) {
                return false;
            }
            owner.setFlag(this.ZhanJueStage, stage);
            return true;
        }
        else if (identifier === 105 /* PhaseStageChangeEvent */) {
            return owner.getFlag(this.GeneralName) !== undefined;
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const unknownEvent = event.triggeredOnEvent;
        const identifier = event_packer_1.EventPacker.getIdentifier(unknownEvent);
        if (identifier === 124 /* CardUseEvent */) {
            const stage = room.getFlag(event.fromId, this.ZhanJueStage);
            if (stage === "BeforeCardUseEffect" /* BeforeCardUseEffect */) {
                event_packer_1.EventPacker.addMiddleware({ tag: this.Name, data: event.fromId }, unknownEvent);
            }
            else {
                const from = room.getPlayerById(event.fromId);
                let drawNum = from.getFlag(this.GeneralName) || 0;
                if (!from.Dead) {
                    await room.drawCards(1, event.fromId, 'top', event.fromId);
                    drawNum++;
                }
                const victims = room.Analytics.getRecordEvents(event => {
                    if (!event.cardIds) {
                        return false;
                    }
                    return event.cardIds[0] === unknownEvent.cardId;
                }, undefined, 'phase').reduce((playerIds, event) => {
                    playerIds.includes(event.toId) || playerIds.push(event.toId);
                    return playerIds;
                }, []);
                if (victims.length > 0) {
                    room.sortPlayersByPosition(victims);
                    for (const vic of victims) {
                        if (room.getPlayerById(vic).Dead) {
                            continue;
                        }
                        await room.drawCards(1, vic, 'top', event.fromId, this.Name);
                        if (vic === event.fromId) {
                            drawNum++;
                        }
                    }
                }
                if (!from.Dead) {
                    room.setFlag(event.fromId, this.GeneralName, drawNum);
                }
            }
        }
        else {
            room.removeFlag(event.fromId, this.GeneralName);
        }
        return true;
    }
};
ZhanJueShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CommonSkill({ name: ZhanJue.Name, description: ZhanJue.Description })
], ZhanJueShadow);
exports.ZhanJueShadow = ZhanJueShadow;
