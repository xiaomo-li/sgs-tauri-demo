"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TuXi = void 0;
const tslib_1 = require("tslib");
const event_packer_1 = require("core/event/event_packer");
const skill_1 = require("core/skills/skill");
let TuXi = class TuXi extends skill_1.TriggerSkill {
    isTriggerable(event, stage) {
        return stage === "CardDrawing" /* CardDrawing */;
    }
    canUse(room, owner, content) {
        if (owner.getFlag(this.Name) !== undefined) {
            room.removeFlag(owner.Id, this.Name);
        }
        const canUse = owner.Id === content.fromId &&
            room.CurrentPlayerPhase === 3 /* DrawCardStage */ &&
            content.bySpecialReason === 0 /* GameStage */ &&
            content.drawAmount > 0;
        if (canUse) {
            room.setFlag(owner.Id, this.Name, content.drawAmount);
        }
        return canUse;
    }
    targetFilter(room, owner, targets) {
        return targets.length > 0 && targets.length <= room.CurrentPhasePlayer.getFlag(this.Name);
    }
    isAvailableTarget(owner, room, target) {
        return owner !== target && room.getPlayerById(target).getCardIds(0 /* HandArea */).length > 0;
    }
    async onTrigger() {
        return true;
    }
    async onEffect(room, skillUseEvent) {
        const { triggeredOnEvent, toIds, fromId } = skillUseEvent;
        const drawCardEvent = triggeredOnEvent;
        drawCardEvent.drawAmount -= toIds.length;
        room.removeFlag(fromId, this.Name);
        for (const toId of toIds) {
            const cardIds = room.getPlayerById(toId).getCardIds(0 /* HandArea */);
            const askForChoosingCard = {
                fromId,
                toId,
                options: {
                    [0 /* HandArea */]: cardIds.length,
                },
                triggeredBySkills: [this.Name],
            };
            room.notify(170 /* AskForChoosingCardFromPlayerEvent */, event_packer_1.EventPacker.createUncancellableEvent(askForChoosingCard), fromId);
            let { selectedCard } = await room.onReceivingAsyncResponseFrom(170 /* AskForChoosingCardFromPlayerEvent */, fromId);
            selectedCard = selectedCard !== undefined ? selectedCard : cardIds[Math.floor(Math.random() * cardIds.length)];
            await room.moveCards({
                movingCards: [{ card: selectedCard, fromArea: 0 /* HandArea */ }],
                fromId: toId,
                toId: fromId,
                toArea: 0 /* HandArea */,
                moveReason: 1 /* ActivePrey */,
                proposer: fromId,
                movedByReason: this.Name,
            });
        }
        return true;
    }
};
TuXi = tslib_1.__decorate([
    skill_1.CommonSkill({ name: 'tuxi', description: 'tuxi_description' })
], TuXi);
exports.TuXi = TuXi;
