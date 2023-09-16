"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PoXiangShadow = exports.PoXiang = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
const skill_wrappers_1 = require("core/skills/skill_wrappers");
const jueyong_1 = require("./jueyong");
let PoXiang = class PoXiang extends skill_1.ActiveSkill {
    canUse(room, owner) {
        return !owner.hasUsedSkill(this.Name) && owner.getCardIds(0 /* HandArea */).length > 0;
    }
    numberOfTargets() {
        return 1;
    }
    isAvailableTarget(owner, room, target) {
        return owner !== target;
    }
    cardFilter(room, owner, cards) {
        return cards.length === 1;
    }
    isAvailableCard(owner, room, cardId) {
        return true;
    }
    async onUse() {
        return true;
    }
    async onEffect(room, event) {
        if (!event.toIds || !event.cardIds) {
            return false;
        }
        const { fromId } = event;
        await room.moveCards({
            movingCards: [{ card: event.cardIds[0], fromArea: room.getPlayerById(fromId).cardFrom(event.cardIds[0]) }],
            fromId,
            toId: event.toIds[0],
            toArea: 0 /* HandArea */,
            moveReason: 2 /* ActiveMove */,
            triggeredBySkills: [this.Name],
        });
        const cardIdsDrawn = await room.drawCards(3, fromId, 'top', fromId, this.Name);
        room
            .getPlayerById(fromId)
            .getCardIds(3 /* OutsideArea */, jueyong_1.JueYong.Name)
            .map(card => ({ card, fromArea: 3 /* OutsideArea */ })).length > 0 &&
            (await room.moveCards({
                movingCards: room
                    .getPlayerById(fromId)
                    .getCardIds(3 /* OutsideArea */, jueyong_1.JueYong.Name)
                    .map(card => ({ card, fromArea: 3 /* OutsideArea */ })),
                fromId,
                toArea: 4 /* DropStack */,
                moveReason: 6 /* PlaceToDropStack */,
                proposer: fromId,
                triggeredBySkills: [this.Name],
            }));
        await room.loseHp(fromId, 1);
        const originalCardIds = room.getFlag(fromId, this.Name) || [];
        originalCardIds.push(...cardIdsDrawn);
        room.getPlayerById(fromId).setFlag(this.Name, originalCardIds);
        room.setCardTag(fromId, this.Name, originalCardIds);
        return true;
    }
};
PoXiang = tslib_1.__decorate([
    skill_wrappers_1.CommonSkill({ name: 'poxiang', description: 'poxiang_description' })
], PoXiang);
exports.PoXiang = PoXiang;
let PoXiangShadow = class PoXiangShadow extends skill_1.TriggerSkill {
    afterLosingSkill(room, owner, content, stage) {
        return room.CurrentPlayerPhase === 7 /* PhaseFinish */ && stage === "PhaseChanged" /* PhaseChanged */;
    }
    isTriggerable(event, stage) {
        return (event_packer_1.EventPacker.getIdentifier(event) === 162 /* AskForCardDropEvent */ ||
            stage === "PhaseChanged" /* PhaseChanged */);
    }
    isFlaggedSkill(room, event, stage) {
        return stage === "PhaseChanged" /* PhaseChanged */;
    }
    canUse(room, owner, content) {
        let canTrigger = false;
        if (event_packer_1.EventPacker.getIdentifier(content) === 162 /* AskForCardDropEvent */) {
            canTrigger = room.CurrentPlayerPhase === 5 /* DropCardStage */ && room.CurrentPhasePlayer.Id === owner.Id;
        }
        else if (event_packer_1.EventPacker.getIdentifier(content) === 104 /* PhaseChangeEvent */) {
            const phaseChangeEvent = content;
            canTrigger = owner.Id === phaseChangeEvent.fromPlayer && phaseChangeEvent.from === 7 /* PhaseFinish */;
        }
        return canTrigger && !!owner.getFlag(this.GeneralName);
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, event) {
        const unknownEvent = event.triggeredOnEvent;
        const identifier = event_packer_1.EventPacker.getIdentifier(unknownEvent);
        if (identifier === 162 /* AskForCardDropEvent */) {
            const askForCardDropEvent = unknownEvent;
            const player = room.getPlayerById(askForCardDropEvent.toId);
            const cardIdsDrawn = player.getFlag(this.GeneralName);
            if (cardIdsDrawn.length > 0) {
                const otherHandCards = player.getCardIds(0 /* HandArea */).filter(card => !cardIdsDrawn.includes(card));
                const discardAmount = otherHandCards.length - player.getMaxCardHold(room);
                askForCardDropEvent.cardAmount = discardAmount;
                askForCardDropEvent.except = askForCardDropEvent.except
                    ? [...askForCardDropEvent.except, ...cardIdsDrawn]
                    : cardIdsDrawn;
            }
        }
        else if (identifier === 104 /* PhaseChangeEvent */) {
            const phaseChangeEvent = unknownEvent;
            const { fromPlayer } = phaseChangeEvent;
            room.getPlayerById(fromPlayer).removeFlag(this.GeneralName);
            room.removeCardTag(fromPlayer, this.GeneralName);
        }
        return true;
    }
};
PoXiangShadow = tslib_1.__decorate([
    skill_wrappers_1.ShadowSkill,
    skill_wrappers_1.PersistentSkill(),
    skill_wrappers_1.CompulsorySkill({ name: PoXiang.GeneralName, description: PoXiang.Description })
], PoXiangShadow);
exports.PoXiangShadow = PoXiangShadow;
