"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChuHaiShadow = exports.ChuHai = void 0;
const tslib_1 = require("tslib");
const card_matcher_1 = require("core/cards/libs/card_matcher");
const event_packer_1 = require("core/event/event_packer");
const engine_1 = require("core/game/engine");
const skill_1 = require("core/skills/skill");
let ChuHai = class ChuHai extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return !owner.hasUsedSkill(this.Name) && owner.getCardIds(0 /* HandArea */).length > 0;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 0;
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, target) {
        return room.canPindian(owner, target);
    }
    isAvailableCard() {
        return false;
    }
    async onUse(room, event) {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, toIds } = event;
        if (!toIds) {
            return false;
        }
        await room.drawCards(1, fromId, 'top', fromId, this.Name);
        const { pindianRecord } = await room.pindian(fromId, toIds, this.Name);
        if (!pindianRecord.length) {
            return false;
        }
        if (pindianRecord[0].winner === fromId) {
            const opponentsHands = room.getPlayerById(toIds[0]).getCardIds(0 /* HandArea */);
            if (opponentsHands.length > 0) {
                room.displayCards(toIds[0], opponentsHands, [fromId]);
                const result = [];
                for (const cardId of opponentsHands) {
                    const type = engine_1.Sanguosha.getCardById(cardId).BaseType;
                    if (!result.includes(type)) {
                        result.push(type);
                        if (result.length === 3) {
                            break;
                        }
                    }
                }
                const toGain = [];
                for (const type of result) {
                    let cardIds = room.findCardsByMatcherFrom(new card_matcher_1.CardMatcher({ type: [type] }));
                    const length = cardIds.length;
                    cardIds = cardIds.concat(room.findCardsByMatcherFrom(new card_matcher_1.CardMatcher({ type: [type] }), false));
                    if (cardIds.length === 0) {
                        continue;
                    }
                    const randomIndex = Math.floor(Math.random() * cardIds.length);
                    toGain.push({
                        card: cardIds[randomIndex],
                        fromArea: randomIndex < length ? 5 /* DrawStack */ : 4 /* DropStack */,
                    });
                }
                if (toGain.length > 0) {
                    await room.moveCards({
                        movingCards: toGain,
                        toId: fromId,
                        toArea: 0 /* HandArea */,
                        moveReason: 2 /* ActiveMove */,
                        proposer: fromId,
                        triggeredBySkills: [this.Name],
                    });
                }
            }
            room.getPlayerById(fromId).setFlag(this.Name, toIds[0]);
        }
        return true;
    }
};
ChuHai = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'chuhai', description: 'chuhai_description' })
], ChuHai);
exports.ChuHai = ChuHai;
let ChuHaiShadow = class ChuHaiShadow extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 4 /* PlayCardStage */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    isAutoTrigger() {
        return true;
    }
    isFlaggedSkill() {
        return true;
    }
    isTriggerable(event, stage) {
        return stage === "AfterDamageEffect" /* AfterDamageEffect */ || stage === "PhaseChanged" /* PhaseChanged */;
    }
    canUse(room, owner, event) {
        if (!owner.getFlag(this.GeneralName)) {
            return false;
        }
        const identifier = event_packer_1.EventPacker.getIdentifier(event);
        if (identifier === 137 /* DamageEvent */) {
            const damageEvent = event;
            return (damageEvent.fromId === owner.Id &&
                damageEvent.toId === owner.getFlag(this.GeneralName) &&
                owner.getEmptyEquipSections().length > 0);
        }
        else if (identifier === 104 /* PhaseChangeEvent */) {
            const phaseChangeEvent = event;
            return phaseChangeEvent.fromPlayer === owner.Id && phaseChangeEvent.from === 4 /* PlayCardStage */;
        }
        return false;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const { fromId, triggeredOnEvent } = event;
        const unknownEvent = triggeredOnEvent;
        const identifier = event_packer_1.EventPacker.getIdentifier(unknownEvent);
        if (identifier === 137 /* DamageEvent */) {
            const types = room.getPlayerById(fromId).getEmptyEquipSections();
            let cardIds = room.findCardsByMatcherFrom(new card_matcher_1.CardMatcher({ type: types }));
            const length = cardIds.length;
            cardIds = cardIds.concat(room.findCardsByMatcherFrom(new card_matcher_1.CardMatcher({ type: types }), false));
            if (cardIds.length > 0) {
                const randomIndex = Math.floor(Math.random() * cardIds.length);
                const movingCards = [
                    {
                        card: cardIds[randomIndex],
                        fromArea: randomIndex < length ? 5 /* DrawStack */ : 4 /* DropStack */,
                    },
                ];
                await room.moveCards({
                    movingCards,
                    toId: fromId,
                    toArea: 1 /* EquipArea */,
                    moveReason: 2 /* ActiveMove */,
                    proposer: fromId,
                    triggeredBySkills: [this.GeneralName],
                });
            }
        }
        else {
            room.removeFlag(fromId, this.GeneralName);
        }
        return true;
    }
};
ChuHaiShadow = tslib_1.__decorate([
    skill_1.ShadowSkill,
    skill_1.PersistentSkill(),
    skill_1.CommonSkill({ name: ChuHai.Name, description: ChuHai.Description })
], ChuHaiShadow);
exports.ChuHaiShadow = ChuHaiShadow;
